function bpmnUtils(bpmnModeler) {
  const elementRegistry = bpmnModeler.get('elementRegistry');
  const elementFactory = bpmnModeler.get('elementFactory');
  const modeling = bpmnModeler.get('modeling');
  const autoPlace = bpmnModeler.get('autoPlace');
  const moddle = bpmnModeler.get('moddle');
  const canvas = bpmnModeler.get('canvas');
  const selection = bpmnModeler.get('selection');

  return {
    getBusinessObject(element) {
      return element.businessObject || element;
    },

    getExtensionElement(businessObject, type) {
      if (!businessObject.extensionElements) {
        return null;
      }

      return businessObject.extensionElements.values.filter(extensionElement => {
        return extensionElement.$instanceOf(type);
      })[0];
    },
    // 다이어그램이 그려진 후 인스턴스까지 변경해야 하면 실행
    reRenderModeler(options) {
      // 기존 인스턴스가 있다면 제거
      // if (bpmnModeler) {
      bpmnModeler.destroy();
      bpmnModeler = null;
      // }

      bpmnModeler = new BpmnModeler(options);
      return bpmnModeler;
    },

    // diagram loading (reloading도 가능)
    async loadDiagram(path) {
      await fetch(path)
        .then(response => response.text())
        .then(xml => {
          // const xml = data.xml || data;
          // return this.importXML(xml);
          bpmnModeler.importXML(xml);
        });
    },
    // diagram을 xml로 파싱 (api 전송 시 등 xml화된 내용이 필요할 경우 사용)
    async saveDiagram() {
      const { xml } = await bpmnModeler.saveXML({ format: true });
      return xml;
    },

    // xml load 후 cavas 내 viewbox 위치 및 사이즈 지정
    setCanvas(settings = {}) {
      requestAnimationFrame(() => {
        // 현재 뷰박스 얻기
        const viewbox = canvas.viewbox();

        // 원하는 위치로 이동
        canvas.viewbox({
          x: -100,
          y: 0,
          width: viewbox.width,
          height: viewbox.height,
          ...settings,
        });
      });
    },

    // 화면 중앙 배치
    setCanvasViewPortAuto() {
      canvas.zoom('fit-viewport', 'auto');
    },

    // diagram을 xml로 다운로드
    downloadXML(fileName) {
      bpmnModeler
        .saveXML({ format: true })
        .then(({ xml }) => {
          const blob = new Blob([xml], { type: 'application/xml' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();

          URL.revokeObjectURL(url);
        })
        .catch(err => {
          console.error('❌ XML 저장 실패:', err);
        });
    },

    // element를 추가 (ex - type=bpmn:Task, props={ name: 'Task_1'})
    createElement(type, props = {}) {
      return elementFactory.createShape({ type, ...props });
    },

    // 객체를 baseElement의 객체 다음으로 추가
    appendElement(element, type = 'bpmn:Task', name = '') {
      const baseElement = typeof element === 'string' ? elementRegistry.get(element) : element;
      if (!baseElement || !autoPlace) return;

      const shape = this.createElement(type);
      autoPlace.append(baseElement, shape);

      if (name) {
        modeling.updateLabel(shape, name);
      }

      return shape;
    },

    // 선택한 객체를 삭제
    removeElement(element) {
      const removeElement = typeof element === 'string' ? elementRegistry.get(element) : element;
      if (removeElement) {
        modeling.removeElements([removeElement]);
      }
    },

    // 객체들끼리 연결
    connectElementsByElementId(baseElement, targetElement, flowType) {
      const startElement =
        typeof baseElement === 'string' ? elementRegistry.get(baseElement) : baseElement;
      const endElement =
        typeof targetElement === 'string' ? elementRegistry.get(targetElement) : targetElement;
      if (startElement && endElement) {
        modeling.connect(startElement, endElement, {
          type: flowType || 'bpmn:SequenceFlow',
        });
      }
    },

    // 객체를 startElement의 객체 다음으로 병렬 게이드웨이를 추가하고 2개의 병렬 객체를 연결
    createParallelTasks(element) {
      const startElement = typeof element === 'string' ? elementRegistry.get(element) : element;
      const gateway = factory.createShape({ type: 'bpmn:ParallelGateway' });
      autoPlace.append(startElement, gateway);

      const gId = gateway.id;
      appendElementByElementId(gId, '병렬 작업 1');
      appendElementByElementId(gId, '병렬 작업 2');
    },

    // 선택한 객체의 속성을 업데이트
    updateProperties(element, props = {}) {
      const updateElement = typeof element === 'string' ? elementRegistry.get(element) : element;
      if (element) {
        modeling.updateProperties(updateElement, props);
      }
    },

    // camunda property 속성 추가 (name: 'formKey', value: 'anyKey')
    addCamundaPropertyInExtensionProperty(element, name, value) {
      const baseElement = typeof element === 'string' ? elementRegistry.get(element) : element;
      // const element = elementRegistry.get(elementId);
      if (!baseElement) return;

      const businessObject = baseElement.businessObject;

      if (!businessObject.extensionElements) {
        businessObject.extensionElements = moddle.create('bpmn:ExtensionElements', {
          values: [],
        });
      }

      const extension = moddle.create('camunda:Properties', {
        values: [
          moddle.create('camunda:Property', {
            name,
            value,
          }),
        ],
      });

      businessObject.extensionElements.values.push(extension);

      this.updateProperties(baseElement, {
        extensionElements: businessObject.extensionElements,
      });
    },
  };
}

// .cavas selector를 이용한 dataset으로 멀티 diagram 생성
function createDiagrams(params) {
  function createModeler(viewerType, config) {
    const BpmnJS = params.bpmnjsMap[viewerType] || BpmnModeler;
    if (!BpmnJS || !config) return null;
    return new BpmnJS({
      ...config,
    });
  }

  async function openDiagram(modeler, element) {
    const diagramURL = element.dataset.diagram;
    if (modeler && (params.xml || diagramURL)) {
      const diagramXML = params.xml
        ? params.xml
        : await fetch(diagramURL).then(response => response.text());
      await modeler.importXML(diagramXML);
    }
  }

  function initDiagram() {
    for (const element of params.elements) {
      const viewerType = element.dataset.editor;
      const id = element.id || '__default';
      const additionalModules = params.additionalModulesMap ? params.additionalModulesMap[id] : [];
      const moddleExtensions = params.additionalModulesMap ? params.moddleExtensionsMap[id] : {};
      const propertiesPanel = params.propertiesPanelMap ? params.propertiesPanelMap[id] : {};
      const modeler = createModeler(viewerType, {
        container: element,
        propertiesPanel,
        additionalModules,
        moddleExtensions,
      });
      openDiagram(modeler, element);
    }
  }
  initDiagram();
}
function extractBaseRenderer(bpmnRenderer) {
  let BaseRenderer = null;
  if (!BaseRenderer) {
    // bpmnRenderer → BpmnRenderer → BaseRenderer → Object
    BaseRenderer = Object.getPrototypeOf(Object.getPrototypeOf(bpmnRenderer)).constructor;
  }
  return BaseRenderer;
}
function isNil(value) {
  return value === null || value === undefined;
}

function svgCreate(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function svgAttr(el, attrs) {
  for (const name in attrs) {
    el.setAttribute(name, attrs[name]);
  }
}

function svgAppend(parent, child) {
  parent.appendChild(child);
}

function svgClasses(el) {
  return {
    add: cls => el.classList.add(cls),
    remove: cls => el.classList.remove(cls),
  };
}

function getBusinessObject(element) {
  return element.businessObject || element;
}

function getExtensionElement(businessObject, type) {
  if (!businessObject.extensionElements) {
    return null;
  }

  return businessObject.extensionElements.values.filter(extensionElement => {
    return extensionElement.$instanceOf(type);
  })[0];
}
// 전역 이벤트 핸들러
function updateCustomAttr(bpmnModeler, input, attrName) {
  const element = bpmnModeler.get('selection').get()[0];
  if (!element) return;

  const modeling = bpmnModeler.get('modeling');
  const bo = element.businessObject;

  // $attrs에 custom 속성 설정
  bo.$attrs = {
    ...bo.$attrs,
    [attrName]: input.value,
  };

  // 트리거용 빈 update (실제 속성 갱신은 위에서 처리)
  modeling.updateProperties(element, {});
}

function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color,
  });

  svgAppend(parentNode, rect);

  return rect;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(
    /[&<>"']/g,
    m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]),
  );
}

// 태그에서 네임스페이스 접두어 제거한 로컬네임 구하기
const localNameOf = node =>
  node?.localName ||
  ((node?.tagName || '').includes(':') ? node.tagName.split(':')[1] : node?.tagName || '');

// 네임스페이스 안전 텍스트 추출
const textByNS = (node, ns, local) => {
  const list = node.getElementsByTagNameNS(ns, local);
  return list && list.length ? (list[0].textContent || '').trim() : '';
};

// 대문자 첫 글자 처리
const cap = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// 화면 중앙 배치
function setCanvasViewPortAuto(canvas) {
  canvas.zoom('fit-viewport', 'auto');
}
