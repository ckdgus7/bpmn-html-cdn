const colorImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor">
  <path d="m12.5 5.5.3-.4 3.6-3.6c.5-.5 1.3-.5 1.7 0l1 1c.5.4.5 1.2 0 1.7l-3.6 3.6-.4.2v.2c0 1.4.6 2 1 2.7v.6l-1.7 1.6c-.2.2-.4.2-.6 0L7.3 6.6a.4.4 0 0 1 0-.6l.3-.3.5-.5.8-.8c.2-.2.4-.1.6 0 .9.5 1.5 1.1 3 1.1zm-9.9 6 4.2-4.2 6.3 6.3-4.2 4.2c-.3.3-.9.3-1.2 0l-.8-.8-.9-.8-2.3-2.9" />
</svg>`;


function ColorContextPadProvider(contextPad, popupMenu, canvas, translate) {

  this._contextPad = contextPad;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._translate = translate;

  contextPad.registerProvider(this);
}


ColorContextPadProvider.$inject = [
  'contextPad',
  'popupMenu',
  'canvas',
  'translate'
];


ColorContextPadProvider.prototype.getContextPadEntries = function(element) {
  return this._createPopupAction([ element ]);
};


ColorContextPadProvider.prototype.getMultiElementContextPadEntries = function(elements) {

  return this._createPopupAction(elements);
};

ColorContextPadProvider.prototype._createPopupAction = function(elements) {

  const translate = this._translate;
  const popupMenu = this._popupMenu;

  return {
    'set-color': {
      group: 'activity',
      className: 'bpmn-icon-color',
      title: translate('Set color'),
      html: `<div class="entry">${colorImageSvg}</div>`,
      action: {
        click: (event, element) => {

          // get start popup draw start position
          var position = {
            ...getStartPosition(element),
            cursor: {
              x: event.x,
              y: event.y
            }
          };

          // open new color-picker popup
          popupMenu.open(elements, 'color-picker', position);
        }
      }
    }
  };

};


// helpers //////////////////////

function getStartPosition(element) {
  var pos = {
    x: element.x + element.width + 10, // padRect.right + X_OFFSET
    y: element.y + element.height / 2 // padRect.top + Y_OFFSET
  };

  return pos;
}

const COLORS = [
  {
    label: 'Default',
    fill: '#ffffff',
    stroke: '#22242A'
  },
  {
    label: 'EmergeRed',
    fill: '#FFC2C2',
    stroke: '#FF0000'
  },
  {
    label: 'EmergeGreen',
    fill: '#C2FFC2',
    stroke: '#44ff00'
  },
  {
    label: 'EmergeBlue',
    fill: '#6691ff',
    stroke: '#0048ff'
  },
  {
    label: 'EmergeYellow',
    fill: '#fdff8f', // Yellow fill
    stroke: '#FFD700' // Gold stroke
  },
  {
    label: 'DissolveRed',
    fill: '#FFFFFF', // White fill
    stroke: '#FF0000' // Red stroke
  },
  {
    label: 'DissolveGreen',
    fill: '#FFFFFF', // White fill
    stroke: '#44ff00' // Green stroke
  },
  {
    label: 'DissolveBlue',
    fill: '#FFFFFF', // White fill
    stroke: '#0048ff' // Blue stroke
  },
  {
    label: 'DissolveYellow',
    fill: '#FFFFFF', // Yellow fill
    stroke: '#FFD700' // Gold stroke
  }
];


function ColorPopupProvider(config, bpmnRendererConfig, popupMenu, modeling, translate) {
  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._translate = translate;

  this._colors = config && config.colors || COLORS;
  this._defaultFillColor = bpmnRendererConfig && bpmnRendererConfig.defaultFillColor || 'white';
  this._defaultStrokeColor = bpmnRendererConfig && bpmnRendererConfig.defaultStrokeColor || 'rgb(34, 36, 42)';

  this._popupMenu.registerProvider('color-picker', this);
}


ColorPopupProvider.$inject = [
  'config.colorPicker',
  'config.bpmnRenderer',
  'popupMenu',
  'modeling',
  'translate'
];


ColorPopupProvider.prototype.getEntries = function(elements) {
  var self = this;

  var colorIconHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="100%" width="100%">
      <rect rx="2" x="1" y="1" width="22" height="22" fill="var(--fill-color)" stroke="var(--stroke-color)" style="stroke-width:2"></rect>
    </svg>
  `;

  var entries = this._colors.map(function(color) {

    var entryColorIconHtml = colorIconHtml.replace('var(--fill-color)', color.fill || self._defaultFillColor)
      .replace('var(--stroke-color)', color.stroke || self._defaultStrokeColor);

    return {
      title: self._translate(color.label),
      id: color.label.toLowerCase() + '-color',
      imageHtml: entryColorIconHtml,
      action: createAction(self._modeling, elements, color)
    };
  });

  return entries;
};


function createAction(modeling, element, color) {
  return function() {
    modeling.setColor(element, color);
  };
}

var BpmnColorPickerModule = {
  __init__: [
    'colorContextPadProvider',
    'colorPopupProvider'
  ],
  colorContextPadProvider: [ 'type', ColorContextPadProvider ],
  colorPopupProvider: [ 'type', ColorPopupProvider ]
};
