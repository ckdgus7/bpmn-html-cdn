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
