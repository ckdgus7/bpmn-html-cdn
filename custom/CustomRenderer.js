
    let BaseRenderer;

    function extractBaseRenderer(bpmnRenderer) {
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
        add: (cls) => el.classList.add(cls),
        remove: (cls) => el.classList.remove(cls)
      };
    }

    function getBusinessObject(element) {
      return element.businessObject || element;
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
        fill: color
      });

      svgAppend(parentNode, rect);

      return rect;
    }

    function getExtensionElement(element, type) {
      if (!element.extensionElements) {
        return;
      }

      return element.extensionElements.values.filter((extensionElement) => {
        return extensionElement.$instanceOf(type);
      })[0];
    }

    function registerCustomRenderer(eventBus, bpmnRenderer) {
      const BaseRenderer = extractBaseRenderer(bpmnRenderer);
      class _CustomRenderer extends BaseRenderer {
        static $inject = ['eventBus', 'bpmnRenderer'];

        constructor(eventBus, bpmnRenderer) {
          super(eventBus, HIGH_PRIORITY);
          this.bpmnRenderer = bpmnRenderer;
        }

        canRender(element) {

          // ignore labels
          return !element.labelTarget;
        }


        drawShape(parentNode, element) {
          const shape = this.bpmnRenderer.drawShape(parentNode, element);

          const suitabilityScore = this.getSuitabilityScore(element);

          if (!isNil(suitabilityScore)) {
            const color = this.getColor(suitabilityScore);

            const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);

            svgAttr(rect, {
              transform: 'translate(-20, -10)'
            });

            var text = svgCreate('text');

            svgAttr(text, {
              fill: '#fff',
              transform: 'translate(-15, 5)'
            });

            svgClasses(text).add('djs-label');

            svgAppend(text, document.createTextNode(suitabilityScore));

            svgAppend(parentNode, text);
          }

          return shape;
        }

        getShapePath(shape) {
          if (is(shape, 'bpmn:Task')) {
            return getRoundRectPath(shape, TASK_BORDER_RADIUS);
          }

          return this.bpmnRenderer.getShapePath(shape);
        }

        getSuitabilityScore(element) {
          const businessObject = getBusinessObject(element);

          const { suitable } = businessObject;

          return Number.isFinite(suitable) ? suitable : null;
        }

        getColor(suitabilityScore) {
          if (suitabilityScore > 75) {
            return COLOR_GREEN;
          } else if (suitabilityScore > 25) {
            return COLOR_YELLOW;
          }

          return COLOR_RED;
        }

        getShapePath(shape) {
          return this.bpmnRenderer.getShapePath(shape);
        }
      }

      CustomRenderer = _CustomRenderer;

      return new CustomRenderer(eventBus, bpmnRenderer);
    }
