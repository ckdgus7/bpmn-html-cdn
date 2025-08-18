'use strict';

/**
 * Flatten array, one level deep.
 *
 * @template T
 *
 * @param {T[][] | T[] | null} [arr]
 *
 * @return {T[]}
 */

const nativeToString = Object.prototype.toString;
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;

function isUndefined(obj) {
  return obj === undefined;
}

function isNil(obj) {
  return obj == null;
}

function isArray(obj) {
  return nativeToString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return nativeToString.call(obj) === '[object Object]';
}

function isNumber(obj) {
  return nativeToString.call(obj) === '[object Number]';
}

/**
 * @param {any} obj
 *
 * @return {boolean}
 */
function isFunction(obj) {
  const tag = nativeToString.call(obj);

  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object AsyncGeneratorFunction]' ||
    tag === '[object Proxy]'
  );
}

/**
 * Return true, if target owns a property with the given key.
 *
 * @param {Object} target
 * @param {String} key
 *
 * @return {Boolean}
 */
function has(target, key) {
  return !isNil(target) && nativeHasOwnProperty.call(target, key);
}

/**
 * @template T
 * @typedef { (
 *   ((e: T) => boolean) |
 *   ((e: T, idx: number) => boolean) |
 *   ((e: T, key: string) => boolean) |
 *   string |
 *   number
 * ) } Matcher
 */

/**
 * @template T
 * @template U
 *
 * @typedef { (
 *   ((e: T) => U) | string | number
 * ) } Extractor
 */


/**
 * @template T
 * @typedef { (val: T, key: any) => boolean } MatchFn
 */

/**
 * @template T
 * @typedef { T[] } ArrayCollection
 */

/**
 * @template T
 * @typedef { { [key: string]: T } } StringKeyValueCollection
 */

/**
 * @template T
 * @typedef { { [key: number]: T } } NumberKeyValueCollection
 */

/**
 * @template T
 * @typedef { StringKeyValueCollection<T> | NumberKeyValueCollection<T> } KeyValueCollection
 */

/**
 * @template T
 * @typedef { KeyValueCollection<T> | ArrayCollection<T> } Collection
 */

/**
 * Find element in collection.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param {Matcher<T>} matcher
 *
 * @return {Object}
 */
function find(collection, matcher) {

  const matchFn = toMatcher(matcher);

  let match;

  forEach(collection, function(val, key) {
    if (matchFn(val, key)) {
      match = val;

      return false;
    }
  });

  return match;

}


/**
 * Iterate over collection; returning something
 * (non-undefined) will stop iteration.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param { ((item: T, idx: number) => (boolean|void)) | ((item: T, key: string) => (boolean|void)) } iterator
 *
 * @return {T} return result that stopped the iteration
 */
function forEach(collection, iterator) {

  let val,
      result;

  if (isUndefined(collection)) {
    return;
  }

  const convertKey = isArray(collection) ? toNum : identity;

  for (let key in collection) {

    if (has(collection, key)) {
      val = collection[key];

      result = iterator(val, convertKey(key));

      if (result === false) {
        return val;
      }
    }
  }
}


/**
 * Return true if some elements in the collection
 * match the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function some(collection, matcher) {

  return !!find(collection, matcher);
}


/**
 * @template T
 * @param {Matcher<T>} matcher
 *
 * @return {MatchFn<T>}
 */
function toMatcher(matcher) {
  return isFunction(matcher) ? matcher : (e) => {
    return e === matcher;
  };
}


function identity(arg) {
  return arg;
}

function toNum(arg) {
  return Number(arg);
}

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
function assign(target, ...others) {
  return Object.assign(target, ...others);
}

const EVENT_GROUP = {
  id: 'events',
  name: 'Events'
};

const TASK_GROUP = {
  id: 'tasks',
  name: 'Tasks'
};

const DATA_GROUP = {
  id: 'data',
  name: 'Data'
};

const PARTICIPANT_GROUP = {
  id: 'participants',
  name: 'Participants'
};

const SUBPROCESS_GROUP = {
  id: 'subprocess',
  name: 'Sub-processes'
};

const GATEWAY_GROUP = {
  id: 'gateways',
  name: 'Gateways'
};

const NONE_EVENTS = [
  {
    label: 'Start event',
    actionName: 'none-start-event',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  {
    label: 'Intermediate throw event',
    actionName: 'none-intermediate-throwing',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'bpmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'Boundary event',
    actionName: 'none-boundary-event',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'bpmn:BoundaryEvent'
    }
  },
  {
    label: 'End event',
    actionName: 'none-end-event',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  }
].map(option => ({ ...option, group: EVENT_GROUP }));

const TYPED_START_EVENTS = [
  {
    label: 'Message start event',
    actionName: 'message-start',
    className: 'bpmn-icon-start-event-message',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer start event',
    actionName: 'timer-start',
    className: 'bpmn-icon-start-event-timer',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition'
    }
  },
  {
    label: 'Conditional start event',
    actionName: 'conditional-start',
    className: 'bpmn-icon-start-event-condition',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Signal start event',
    actionName: 'signal-start',
    className: 'bpmn-icon-start-event-signal',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  }
].map(option => ({ ...option, group: EVENT_GROUP }));

const TYPED_INTERMEDIATE_EVENT = [
  {
    label: 'Message intermediate catch event',
    actionName: 'message-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-message',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Message intermediate throw event',
    actionName: 'message-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-message',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer intermediate catch event',
    actionName: 'timer-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-timer',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition'
    }
  },
  {
    label: 'Escalation intermediate throw event',
    actionName: 'escalation-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-escalation',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Conditional intermediate catch event',
    actionName: 'conditional-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-condition',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Link intermediate catch event',
    actionName: 'link-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-link',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:LinkEventDefinition',
      eventDefinitionAttrs: {
        name: ''
      }
    }
  },
  {
    label: 'Link intermediate throw event',
    actionName: 'link-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-link',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:LinkEventDefinition',
      eventDefinitionAttrs: {
        name: ''
      }
    }
  },
  {
    label: 'Compensation intermediate throw event',
    actionName: 'compensation-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-compensation',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Signal intermediate catch event',
    actionName: 'signal-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-signal',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  },
  {
    label: 'Signal intermediate throw event',
    actionName: 'signal-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-signal',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  }
].map(option => ({ ...option, group: EVENT_GROUP }));

const TYPED_BOUNDARY_EVENT = [
  {
    label: 'Message boundary event',
    actionName: 'message-boundary',
    className: 'bpmn-icon-intermediate-event-catch-message',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer boundary event',
    actionName: 'timer-boundary',
    className: 'bpmn-icon-intermediate-event-catch-timer',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition'
    }
  },
  {
    label: 'Escalation boundary event',
    actionName: 'escalation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-escalation',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Conditional boundary event',
    actionName: 'conditional-boundary',
    className: 'bpmn-icon-intermediate-event-catch-condition',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Error boundary event',
    actionName: 'error-boundary',
    className: 'bpmn-icon-intermediate-event-catch-error',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:ErrorEventDefinition'
    }
  },
  {
    label: 'Cancel boundary event',
    actionName: 'cancel-boundary',
    className: 'bpmn-icon-intermediate-event-catch-cancel',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:CancelEventDefinition'
    }
  },
  {
    label: 'Signal boundary event',
    actionName: 'signal-boundary',
    className: 'bpmn-icon-intermediate-event-catch-signal',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  },
  {
    label: 'Compensation boundary event',
    actionName: 'compensation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-compensation',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Message boundary event (non-interrupting)',
    actionName: 'non-interrupting-message-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-message',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Timer boundary event (non-interrupting)',
    actionName: 'non-interrupting-timer-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-timer',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Escalation boundary event (non-interrupting)',
    actionName: 'non-interrupting-escalation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-escalation',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Conditional boundary event (non-interrupting)',
    actionName: 'non-interrupting-conditional-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-condition',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Signal boundary event (non-interrupting)',
    actionName: 'non-interrupting-signal-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-signal',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition',
      cancelActivity: false
    }
  }
].map(option => ({ ...option, group: EVENT_GROUP }));

const TYPED_END_EVENT = [
  {
    label: 'Message end event',
    actionName: 'message-end',
    className: 'bpmn-icon-end-event-message',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Escalation end event',
    actionName: 'escalation-end',
    className: 'bpmn-icon-end-event-escalation',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Error end event',
    actionName: 'error-end',
    className: 'bpmn-icon-end-event-error',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:ErrorEventDefinition'
    }
  },
  {
    label: 'Cancel end event',
    actionName: 'cancel-end',
    className: 'bpmn-icon-end-event-cancel',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:CancelEventDefinition'
    }
  },
  {
    label: 'Compensation end event',
    actionName: 'compensation-end',
    className: 'bpmn-icon-end-event-compensation',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Signal end event',
    actionName: 'signal-end',
    className: 'bpmn-icon-end-event-signal',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  },
  {
    label: 'Terminate end event',
    actionName: 'terminate-end',
    className: 'bpmn-icon-end-event-terminate',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:TerminateEventDefinition'
    }
  }
].map(option => ({ ...option, group: EVENT_GROUP }));

const GATEWAY$1 = [
  {
    label: 'Exclusive gateway',
    actionName: 'exclusive-gateway',
    className: 'bpmn-icon-gateway-xor',
    target: {
      type: 'bpmn:ExclusiveGateway'
    }
  },
  {
    label: 'Parallel gateway',
    actionName: 'parallel-gateway',
    className: 'bpmn-icon-gateway-parallel',
    target: {
      type: 'bpmn:ParallelGateway'
    }
  },
  {
    label: 'Inclusive gateway',
    search: 'or',
    actionName: 'inclusive-gateway',
    className: 'bpmn-icon-gateway-or',
    target: {
      type: 'bpmn:InclusiveGateway'
    },
    rank: -1
  },
  {
    label: 'Complex gateway',
    actionName: 'complex-gateway',
    className: 'bpmn-icon-gateway-complex',
    target: {
      type: 'bpmn:ComplexGateway'
    },
    rank: -1
  },
  {
    label: 'Event-based gateway',
    actionName: 'event-based-gateway',
    className: 'bpmn-icon-gateway-eventbased',
    target: {
      type: 'bpmn:EventBasedGateway',
      instantiate: false,
      eventGatewayType: 'Exclusive'
    }
  }
].map(option => ({ ...option, group: GATEWAY_GROUP }));

const SUBPROCESS = [
  {
    label: 'Call activity',
    actionName: 'call-activity',
    className: 'bpmn-icon-call-activity',
    target: {
      type: 'bpmn:CallActivity'
    }
  },
  {
    label: 'Transaction',
    actionName: 'transaction',
    className: 'bpmn-icon-transaction',
    target: {
      type: 'bpmn:Transaction',
      isExpanded: true
    }
  },
  {
    label: 'Event sub-process',
    search: 'subprocess',
    actionName: 'event-subprocess',
    className: 'bpmn-icon-event-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      triggeredByEvent: true,
      isExpanded: true
    }
  },
  {
    label: 'Sub-process (collapsed)',
    search: 'subprocess',
    actionName: 'collapsed-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'bpmn:SubProcess',
      isExpanded: false
    }
  },
  {
    label: 'Sub-process (expanded)',
    search: 'subprocess',
    actionName: 'expanded-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Ad-hoc sub-process (collapsed)',
    search: 'adhoc subprocess',
    actionName: 'collapsed-ad-hoc-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'bpmn:AdHocSubProcess',
      isExpanded: false
    }
  },
  {
    label: 'Ad-hoc sub-process (expanded)',
    search: 'adhoc subprocess',
    actionName: 'expanded-ad-hoc-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:AdHocSubProcess',
      isExpanded: true
    }
  }
].map(option => ({ ...option, group: SUBPROCESS_GROUP }));

const TASK$1 = [
  {
    label: 'Task',
    actionName: 'task',
    className: 'bpmn-icon-task',
    target: {
      type: 'bpmn:Task'
    }
  },
  {
    label: 'User task',
    actionName: 'user-task',
    className: 'bpmn-icon-user',
    target: {
      type: 'bpmn:UserTask'
    }
  },
  {
    label: 'Service task',
    actionName: 'service-task',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:ServiceTask'
    }
  },
  {
    label: 'Send task',
    actionName: 'send-task',
    className: 'bpmn-icon-send',
    target: {
      type: 'bpmn:SendTask'
    },
    rank: -1
  },
  {
    label: 'Receive task',
    actionName: 'receive-task',
    className: 'bpmn-icon-receive',
    target: {
      type: 'bpmn:ReceiveTask'
    },
    rank: -1
  },
  {
    label: 'Manual task',
    actionName: 'manual-task',
    className: 'bpmn-icon-manual',
    target: {
      type: 'bpmn:ManualTask'
    },
    rank: -1
  },
  {
    label: 'Business rule task',
    actionName: 'rule-task',
    className: 'bpmn-icon-business-rule',
    target: {
      type: 'bpmn:BusinessRuleTask'
    }
  },
  {
    label: 'Script task',
    actionName: 'script-task',
    className: 'bpmn-icon-script',
    target: {
      type: 'bpmn:ScriptTask'
    }
  }
].map(option => ({ ...option, group: TASK_GROUP }));

const DATA_OBJECTS = [
  {
    label: 'Data store reference',
    actionName: 'data-store-reference',
    className: 'bpmn-icon-data-store',
    target: {
      type: 'bpmn:DataStoreReference'
    }
  },
  {
    label: 'Data object reference',
    actionName: 'data-object-reference',
    className: 'bpmn-icon-data-object',
    target: {
      type: 'bpmn:DataObjectReference'
    }
  }
].map(option => ({ ...option, group: DATA_GROUP }));

const PARTICIPANT$1 = [
  {
    label: 'Expanded pool/participant',
    search: 'Non-empty pool/participant',
    actionName: 'expanded-pool',
    className: 'bpmn-icon-participant',
    target: {
      type: 'bpmn:Participant',
      isExpanded: true
    }
  },
  {
    label: 'Empty pool/participant',
    search: 'Collapsed pool/participant',
    actionName: 'collapsed-pool',
    className: 'bpmn-icon-lane',
    target: {
      type: 'bpmn:Participant',
      isExpanded: false
    }
  }
].map(option => ({ ...option, group: PARTICIPANT_GROUP }));

const CREATE_OPTIONS = [
  ...GATEWAY$1,
  ...TASK$1,
  ...SUBPROCESS,
  ...NONE_EVENTS,
  ...TYPED_START_EVENTS,
  ...TYPED_INTERMEDIATE_EVENT,
  ...TYPED_END_EVENT,
  ...TYPED_BOUNDARY_EVENT,
  ...DATA_OBJECTS,
  ...PARTICIPANT$1
];

/**
 * This module is an append menu provider for the popup menu.
 */
function AppendMenuProvider(
    elementFactory, popupMenu,
    create, autoPlace, rules,
    mouse, translate
) {

  this._elementFactory = elementFactory;
  this._popupMenu = popupMenu;
  this._create = create;
  this._autoPlace = autoPlace;
  this._rules = rules;
  this._create = create;
  this._mouse = mouse;
  this._translate = translate;

  this.register();
}

AppendMenuProvider.$inject = [
  'elementFactory',
  'popupMenu',
  'create',
  'autoPlace',
  'rules',
  'mouse',
  'translate'
];

/**
 * Register append menu provider in the popup menu
 */
AppendMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-append', this);
};

/**
 * Gets the append options for the given element as menu entries
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
AppendMenuProvider.prototype.getPopupMenuEntries = function(element) {
  const rules = this._rules;
  const translate = this._translate;

  const entries = {};

  if (!rules.allowed('shape.append', { element: element })) {
    return [];
  }

  // filter out elements with no incoming connections
  const appendOptions = this._filterEntries(CREATE_OPTIONS);

  // map options to menu entries
  appendOptions.forEach(option => {
    const {
      actionName,
      className,
      label,
      target,
      description,
      group,
      search,
      rank
    } = option;

    entries[`append-${actionName}`] = {
      label: label && translate(label),
      className,
      description,
      group: group && {
        ...group,
        name: translate(group.name)
      },
      search,
      rank,
      action: this._createEntryAction(element, target)
    };
  });

  return entries;
};

/**
 * Filter out entries from the options.
 *
 * @param {Array<Object>} entries
 *
 * @return {Array<Object>} filtered entries
 */
AppendMenuProvider.prototype._filterEntries = function(entries) {
  return entries.filter(option => {

    const target = option.target;
    const {
      type,
      eventDefinitionType
    } = target;

    if ([
      'bpmn:StartEvent',
      'bpmn:Participant'
    ].includes(type)) {
      return false;
    }

    if (type === 'bpmn:BoundaryEvent' && isUndefined(eventDefinitionType)) {
      return false;
    }

    return true;
  });
};

/**
 * Create an action for a given target.
 *
 * @param {djs.model.Base} element
 * @param {Object} target
 *
 * @return {Object}
 */
AppendMenuProvider.prototype._createEntryAction = function(element, target) {
  const elementFactory = this._elementFactory;
  const autoPlace = this._autoPlace;
  const create = this._create;
  const mouse = this._mouse;


  const autoPlaceElement = () => {
    const newElement = elementFactory.create('shape', target);
    autoPlace.append(element, newElement);
  };

  const manualPlaceElement = (event) => {
    const newElement = elementFactory.create('shape', target);

    if (event instanceof KeyboardEvent) {
      event = mouse.getLastMoveEvent();
    }

    return create.start(event, newElement, {
      source: element
    });
  };

  return {
    click: this._canAutoPlaceElement(target) ? autoPlaceElement : manualPlaceElement,
    dragstart: manualPlaceElement
  };
};

/**
 * Check if the element should be auto placed.
 *
 * @param {Object} target
 *
 * @return {Boolean}
 */
AppendMenuProvider.prototype._canAutoPlaceElement = (target) => {
  const { type } = target;

  if (type === 'bpmn:BoundaryEvent') {
    return false;
  }

  if (type === 'bpmn:SubProcess' && target.triggeredByEvent) {
    return false;
  }

  if (type === 'bpmn:IntermediateCatchEvent' && target.eventDefinitionType === 'bpmn:LinkEventDefinition') {
    return false;
  }

  return true;
};

const appendIcon = `<svg width="22" height="22" viewBox="0 0 5.82 5.82" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M1.3 3.4c.3 0 .5-.2.5-.5s-.2-.4-.5-.4c-.2 0-.4.1-.4.4 0 .3.2.5.4.5zM3 3.4c.2 0 .4-.2.4-.5s-.2-.4-.4-.4c-.3 0-.5.1-.5.4 0 .3.2.5.5.5zM4.6 3.4c.2 0 .4-.2.4-.5s-.2-.4-.4-.4c-.3 0-.5.1-.5.4 0 .3.2.5.5.5z"/>
</svg>`;
const createIcon = `<svg width="46" height="46" viewBox="-2 -2 9.82 9.82" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M1.3 3.4c.3 0 .5-.2.5-.5s-.2-.4-.5-.4c-.2 0-.4.1-.4.4 0 .3.2.5.4.5zM3 3.4c.2 0 .4-.2.4-.5s-.2-.4-.4-.4c-.3 0-.5.1-.5.4 0 .3.2.5.5.5zM4.6 3.4c.2 0 .4-.2.4-.5s-.2-.4-.4-.4c-.3 0-.5.1-.5.4 0 .3.2.5.5.5z"/>
</svg>`;

/**
 * A provider for append context pad button
 */
function AppendContextPadProvider(contextPad, popupMenu, translate, canvas, rules) {

  this._contextPad = contextPad;
  this._popupMenu = popupMenu;
  this._translate = translate;
  this._canvas = canvas;
  this._rules = rules;

  this.register();
}

AppendContextPadProvider.$inject = [
  'contextPad',
  'popupMenu',
  'translate',
  'canvas',
  'rules'
];

/**
 * Register append button provider in the context pad
 */
AppendContextPadProvider.prototype.register = function() {
  this._contextPad.registerProvider(this);
};

/**
 * Gets the append context pad entry
 *
 * @param {djs.model.Base} element
 * @returns {Object} entries
 */
AppendContextPadProvider.prototype.getContextPadEntries = function(element) {
  const popupMenu = this._popupMenu;
  const translate = this._translate;
  const rules = this._rules;
  const getAppendMenuPosition = this._getAppendMenuPosition.bind(this);

  if (rules.allowed('shape.append', { element })) {

    // append menu entry
    return {
      'append': {
        group: 'model',
        html: `<div class="entry">${appendIcon}</div>`,
        title: translate('Append element'),
        action: {
          click: function(event, element) {

            // const position = assign(getAppendMenuPosition(element), {
            //   cursor: { x: event.x, y: event.y }
            // });
            const position = {
              x: element.x + element.width + 10, // padRect.right + X_OFFSET
              y: element.y + element.height, // padRect.top + Y_OFFSET
            cursor: {
              x: event.x,
              y: event.y
            }
          };

            popupMenu.open(element, 'bpmn-append', position, {
              title: translate('Append element'),
              width: 300,
              search: true
            });
          }
        }
      }
    };
  }
};

/**
 * Calculates the position for the append menu relatively to the element
 *
 * @param {djs.model.Base} element
 * @returns {Object}
 */
AppendContextPadProvider.prototype._getAppendMenuPosition = function(element) {
  const X_OFFSET = 5;

  const pad = this._canvas.getContainer().querySelector('.djs-context-pad');

  const padRect = pad.getBoundingClientRect();

  const pos = {
    x: padRect.right + X_OFFSET,
    y: padRect.top
  };

  return pos;
};

function e(e,t){t&&(e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}));}

/**
 * @typedef { import('../model/Types').Element } Element
 * @typedef { import('../model/Types').ModdleElement } ModdleElement
 */

/**
 * Is an element of the given BPMN type?
 *
 * @param  {Element|ModdleElement} element
 * @param  {string} type
 *
 * @return {boolean}
 */
function is(element, type) {
  var bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}


/**
 * Return true if element has any of the given types.
 *
 * @param {Element|ModdleElement} element
 * @param {string[]} types
 *
 * @return {boolean}
 */
function isAny(element, types) {
  return some(types, function(t) {
    return is(element, t);
  });
}

/**
 * Return the business object for a given element.
 *
 * @param {Element|ModdleElement} element
 *
 * @return {ModdleElement}
 */
function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}

/**
 * Return the di object for a given element.
 *
 * @param {Element} element
 *
 * @return {ModdleElement}
 */
function getDi(element) {
  return element && element.di;
}

/**
 * Checks whether a value is an instance of Label.
 *
 * @param {any} value
 *
 * @return {boolean}
 */
function isLabel(value) {
  return isObject(value) && has(value, 'labelTarget');
}

/**
 * @typedef {import('../core/Types').ElementLike} ElementLike
 * @typedef {import('../core/EventBus').default} EventBus
 * @typedef {import('./CommandStack').CommandContext} CommandContext
 *
 * @typedef {string|string[]} Events
 * @typedef { (context: CommandContext) => ElementLike[] | void } HandlerFunction
 * @typedef { (context: CommandContext) => void } ComposeHandlerFunction
 */

var DEFAULT_PRIORITY = 1000;

/**
 * A utility that can be used to plug into the command execution for
 * extension and/or validation.
 *
 * @class
 * @constructor
 *
 * @example
 *
 * ```javascript
 * import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
 *
 * class CommandLogger extends CommandInterceptor {
 *   constructor(eventBus) {
 *     super(eventBus);
 *
 *   this.preExecute('shape.create', (event) => {
 *     console.log('commandStack.shape-create.preExecute', event);
 *   });
 * }
 * ```
 *
 * @param {EventBus} eventBus
 */
function CommandInterceptor(eventBus) {

  /**
   * @type {EventBus}
   */
  this._eventBus = eventBus;
}

CommandInterceptor.$inject = [ 'eventBus' ];

function unwrapEvent(fn, that) {
  return function(event) {
    return fn.call(that || null, event.context, event.command, event);
  };
}


/**
 * Intercept a command during one of the phases.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {string} [hook] phase to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.on = function(events, hook, priority, handlerFn, unwrap, that) {

  if (isFunction(hook) || isNumber(hook)) {
    that = unwrap;
    unwrap = handlerFn;
    handlerFn = priority;
    priority = hook;
    hook = null;
  }

  if (isFunction(priority)) {
    that = unwrap;
    unwrap = handlerFn;
    handlerFn = priority;
    priority = DEFAULT_PRIORITY;
  }

  if (isObject(unwrap)) {
    that = unwrap;
    unwrap = false;
  }

  if (!isFunction(handlerFn)) {
    throw new Error('handlerFn must be a function');
  }

  if (!isArray(events)) {
    events = [ events ];
  }

  var eventBus = this._eventBus;

  forEach(events, function(event) {

    // concat commandStack(.event)?(.hook)?
    var fullEvent = [ 'commandStack', event, hook ].filter(function(e) { return e; }).join('.');

    eventBus.on(fullEvent, priority, unwrap ? unwrapEvent(handlerFn, that) : handlerFn, that);
  });
};

/**
 * Add a <canExecute> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.canExecute = createHook('canExecute');

/**
 * Add a <preExecute> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.preExecute = createHook('preExecute');

/**
 * Add a <preExecuted> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.preExecuted = createHook('preExecuted');

/**
 * Add a <execute> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.execute = createHook('execute');

/**
 * Add a <executed> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.executed = createHook('executed');

/**
 * Add a <postExecute> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.postExecute = createHook('postExecute');

/**
 * Add a <postExecuted> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.postExecuted = createHook('postExecuted');

/**
 * Add a <revert> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.revert = createHook('revert');

/**
 * Add a <reverted> phase of command interceptor.
 *
 * @param {Events} [events] command(s) to intercept
 * @param {number} [priority]
 * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
 * @param {boolean} [unwrap] whether the event should be unwrapped
 * @param {any} [that]
 */
CommandInterceptor.prototype.reverted = createHook('reverted');

/*
 * Add prototype methods for each phase of command execution (e.g. execute,
 * revert).
 *
 * @param {string} hook
 *
 * @return { (
 *   events?: Events,
 *   priority?: number,
 *   handlerFn: ComposeHandlerFunction|HandlerFunction,
 *   unwrap?: boolean
 * ) => any }
 */
function createHook(hook) {

  /**
   * @this {CommandInterceptor}
   *
   * @param {Events} [events]
   * @param {number} [priority]
   * @param {ComposeHandlerFunction|HandlerFunction} handlerFn
   * @param {boolean} [unwrap]
   * @param {any} [that]
   */
  const hookFn = function(events, priority, handlerFn, unwrap, that) {

    if (isFunction(events) || isNumber(events)) {
      that = unwrap;
      unwrap = handlerFn;
      handlerFn = priority;
      priority = events;
      events = null;
    }

    this.on(events, hook, priority, handlerFn, unwrap, that);
  };

  return hookFn;
}

/**
 * @typedef {import('../../core/EventBus').default} EventBus
 */

/**
 * A basic provider that may be extended to implement modeling rules.
 *
 * Extensions should implement the init method to actually add their custom
 * modeling checks. Checks may be added via the #addRule(action, fn) method.
 *
 * @class
 *
 * @param {EventBus} eventBus
 */
function RuleProvider(eventBus) {
  CommandInterceptor.call(this, eventBus);

  this.init();
}

RuleProvider.$inject = [ 'eventBus' ];

e(RuleProvider, CommandInterceptor);


/**
 * Adds a modeling rule for the given action, implemented through
 * a callback function.
 *
 * The callback receives a modeling specific action context
 * to perform its check. It must return `false` to disallow the
 * action from happening or `true` to allow the action. Usually returing
 * `null` denotes that a particular interaction shall be ignored.
 * By returning nothing or `undefined` you pass evaluation to lower
 * priority rules.
 *
 * @example
 *
 * ```javascript
 * ResizableRules.prototype.init = function() {
 *
 *   \/**
 *    * Return `true`, `false` or nothing to denote
 *    * _allowed_, _not allowed_ and _continue evaluating_.
 *    *\/
 *   this.addRule('shape.resize', function(context) {
 *
 *     var shape = context.shape;
 *
 *     if (!context.newBounds) {
 *       // check general resizability
 *       if (!shape.resizable) {
 *         return false;
 *       }
 *
 *       // not returning anything (read: undefined)
 *       // will continue the evaluation of other rules
 *       // (with lower priority)
 *       return;
 *     } else {
 *       // element must have minimum size of 10*10 points
 *       return context.newBounds.width > 10 && context.newBounds.height > 10;
 *     }
 *   });
 * };
 * ```
 *
 * @param {string|string[]} actions the identifier for the modeling action to check
 * @param {number} [priority] the priority at which this rule is being applied
 * @param {(any) => any} fn the callback function that performs the actual check
 */
RuleProvider.prototype.addRule = function(actions, priority, fn) {

  var self = this;

  if (typeof actions === 'string') {
    actions = [ actions ];
  }

  actions.forEach(function(action) {

    self.canExecute(action, priority, function(context, action, event) {
      return fn(context);
    }, true);
  });
};

/**
 * Implement this method to add new rules during provider initialization.
 */
RuleProvider.prototype.init = function() {};

/**
 * Append anything modeling rules
 */
function AppendRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

e(AppendRules, RuleProvider);

AppendRules.$inject = [
  'eventBus'
];

AppendRules.prototype.init = function() {
  this.addRule('shape.append', function(context) {

    const source = context.element;

    const businessObject = getBusinessObject(source);

    if (isLabel(source)) {
      return false;
    }

    if (isAny(source, [
      'bpmn:EndEvent',
      'bpmn:Group',
      'bpmn:TextAnnotation',
      'bpmn:Lane',
      'bpmn:Participant',
      'bpmn:DataStoreReference',
      'bpmn:DataObjectReference'
    ])) {
      return false;
    }

    if (isConnection(source)) {
      return false;
    }

    if (is(source, 'bpmn:IntermediateThrowEvent') && hasEventDefinition(source, 'bpmn:LinkEventDefinition')) {
      return false;
    }

    if (is(source, 'bpmn:SubProcess') && businessObject.triggeredByEvent) {
      return false;
    }
  });

};


// helpers //////////////
function hasEventDefinition(element, eventDefinition) {
  const bo = getBusinessObject(element);

  return !!find(bo.eventDefinitions || [], function(definition) {
    return is(definition, eventDefinition);
  });
}

function isConnection(element) {
  return element.waypoints;
}

var AppendMenuModule = {
  __init__: [
    'appendMenuProvider',
    'appendContextPadProvider',
    'appendRules'
  ],
  appendMenuProvider: [ 'type', AppendMenuProvider ],
  appendContextPadProvider: [ 'type', AppendContextPadProvider ],
  appendRules: [ 'type', AppendRules ]
};

/**
 * This module is a create menu provider for the popup menu.
 */
function CreateMenuProvider(
    elementFactory, popupMenu, create,
    autoPlace, mouse, translate
) {
  this._elementFactory = elementFactory;
  this._popupMenu = popupMenu;
  this._create = create;
  this._autoPlace = autoPlace;
  this._mouse = mouse;
  this._translate = translate;

  this.register();
}

CreateMenuProvider.$inject = [
  'elementFactory',
  'popupMenu',
  'create',
  'autoPlace',
  'mouse',
  'translate'
];

/**
 * Register create menu provider in the popup menu
 */
CreateMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-create', this);
};

/**
 * Returns the create options as menu entries
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
CreateMenuProvider.prototype.getPopupMenuEntries = function() {

  const entries = {};

  // map options to menu entries
  CREATE_OPTIONS.forEach(option => {
    const {
      actionName,
      className,
      label,
      target,
      description,
      group,
      search,
      rank
    } = option;

    const targetAction = this._createEntryAction(target);

    entries[`create-${actionName}`] = {
      label: label && this._translate(label),
      className,
      description,
      group: group && {
        ...group,
        name: this._translate(group.name)
      },
      search,
      rank,
      action: {
        click: targetAction,
        dragstart: targetAction
      }
    };
  });

  return entries;
};

/**
 * Create an action for a given target
 *
 * @param {Object} target
 * @returns {Object}
 */
CreateMenuProvider.prototype._createEntryAction = function(target) {

  const create = this._create;
  const mouse = this._mouse;
  const popupMenu = this._popupMenu;
  const elementFactory = this._elementFactory;

  let newElement;

  return (event) => {
    popupMenu.close();

    // create the new element
    if (target.type === 'bpmn:Participant') {
      newElement = elementFactory.createParticipantShape(target);
    } else {
      newElement = elementFactory.create('shape', target);
    }

    // use last mouse event if triggered via keyboard
    if (event instanceof KeyboardEvent) {
      event = mouse.getLastMoveEvent();
    }

    return create.start(event, newElement);
  };
};

var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

function query(selector, el) {
  el = el || document;

  return el.querySelector(selector);
}

const LOWER_PRIORITY = 900;

/**
 * A palette provider for the create elements menu.
 */
function CreatePaletteProvider(palette, translate, popupMenu, canvas, mouse) {

  this._palette = palette;
  this._translate = translate;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._mouse = mouse;

  this.register();
}

CreatePaletteProvider.$inject = [
  'palette',
  'translate',
  'popupMenu',
  'canvas',
  'mouse'
];

/**
 * Register create button provider in the palette
 */
CreatePaletteProvider.prototype.register = function() {
  this._palette.registerProvider(LOWER_PRIORITY, this);
};

/**
 * Gets the palette create entry
 *
 * @param {djs.model.Base} element
 * @returns {Object}
 */
CreatePaletteProvider.prototype.getPaletteEntries = function(element) {
  const translate = this._translate,
        popupMenu = this._popupMenu,
        canvas = this._canvas,
        mouse = this._mouse;

  const getPosition = (event) => {
    const X_OFFSET = 35;
    const Y_OFFSET = 10;

    if (event instanceof KeyboardEvent) {
      event = mouse.getLastMoveEvent();
      return { x: event.x, y: event.y };
    }

    const target = event && event.target || query('.djs-palette [data-action="create"]');
    const targetPosition = target.getBoundingClientRect();
    return target && {
      x: targetPosition.left + targetPosition.width / 2 + X_OFFSET,
      // y: targetPosition.top + targetPosition.height / 2 + Y_OFFSET
      y: 0
    };
  };

  return {
    'create': {
      group: 'create',
      html: `<div class="entry"> ${createIcon}</div>`,
      title: translate('Create element'),
      action: {
        click: function(event) {
          const position = getPosition(event);

          const element = canvas.getRootElement();

          popupMenu.open(element, 'bpmn-create', position, {
            title: translate('Create element'),
            width: 300,
            search: true
          });
        }
      }
    }
  };
};

var CreateMenuModule = {
  __init__: [
    'createMenuProvider',
    'createPaletteProvider'
  ],
  createMenuProvider: [ 'type', CreateMenuProvider ],
  createPaletteProvider: [ 'type', CreatePaletteProvider ]
};

/**
 * Registers and executes BPMN specific editor actions.
 *
 * @param {Injector} injector
 */
function CreateAppendEditorActions(injector) {
  this._injector = injector;

  this.registerActions();
}

CreateAppendEditorActions.$inject = [
  'injector'
];

/**
 * Register actions.
 *
 * @param {Injector} injector
 */
CreateAppendEditorActions.prototype.registerActions = function() {
  const editorActions = this._injector.get('editorActions', false);
  const selection = this._injector.get('selection', false);
  const contextPad = this._injector.get('contextPad', false);
  const palette = this._injector.get('palette', false);
  const popupMenu = this._injector.get('popupMenu', false);

  const actions = {};

  // append
  if (selection && contextPad && palette && popupMenu && palette) {
    assign(actions, {
      'appendElement': function(event) {
        const selected = selection && selection.get();

        if (selected.length == 1 && !popupMenu.isEmpty(selected[0], 'bpmn-append')) {
          contextPad.triggerEntry('append', 'click', event);
        } else {
          palette.triggerEntry('create', 'click', event);
        }
      }
    });
  }

  // create
  if (palette) {
    assign(actions, {
      'createElement': function(event) {
        palette.triggerEntry('create', 'click', event);
      } }
    );
  }

  editorActions && editorActions.register(actions);

};

var EditorActionsModule = {
  __depends__: [
    AppendMenuModule,
    CreateMenuModule
  ],
  __init__: [
    'createAppendEditorActions'
  ],
  createAppendEditorActions: [ 'type', CreateAppendEditorActions ]
};

var KEYS_COPY = [ 'c', 'C' ];
var KEYS_PASTE = [ 'v', 'V' ];
var KEYS_REDO = [ 'y', 'Y' ];
var KEYS_UNDO = [ 'z', 'Z' ];

/**
 * @param {KeyboardEvent} event
 * @return {boolean}
 */
function isCmd(event) {

  // ensure we don't react to AltGr
  // (mapped to CTRL + ALT)
  if (event.altKey) {
    return false;
  }

  return event.ctrlKey || event.metaKey;
}

/**
 * Checks if key pressed is one of provided keys.
 *
 * @param {string|string[]} keys
 * @param {KeyboardEvent} event
 * @return {boolean}
 */
function isKey(keys, event) {
  keys = isArray(keys) ? keys : [ keys ];

  return keys.indexOf(event.key) !== -1 || keys.indexOf(event.code) !== -1;
}

/**
 * @param {KeyboardEvent} event
 */
function isShift(event) {
  return event.shiftKey;
}

/**
 * @param {KeyboardEvent} event
 */
function isCopy(event) {
  return isCmd(event) && isKey(KEYS_COPY, event);
}

/**
 * @param {KeyboardEvent} event
 */
function isPaste(event) {
  return isCmd(event) && isKey(KEYS_PASTE, event);
}

/**
 * @param {KeyboardEvent} event
 */
function isUndo(event) {
  return isCmd(event) && !isShift(event) && isKey(KEYS_UNDO, event);
}

/**
 * @param {KeyboardEvent} event
 */
function isRedo(event) {
  return isCmd(event) && (
    isKey(KEYS_REDO, event) || (
      isKey(KEYS_UNDO, event) && isShift(event)
    )
  );
}

var LOW_PRIORITY = 500;


/**
 * Adds default keyboard bindings.
 *
 * This does not pull in any features will bind only actions that
 * have previously been registered against the editorActions component.
 *
 * @param {EventBus} eventBus
 * @param {Keyboard} keyboard
 */
function KeyboardBindings(eventBus, keyboard) {

  var self = this;

  eventBus.on('editorActions.init', LOW_PRIORITY, function(event) {

    var editorActions = event.editorActions;

    self.registerBindings(keyboard, editorActions);
  });
}

KeyboardBindings.$inject = [
  'eventBus',
  'keyboard'
];


/**
 * Register available keyboard bindings.
 *
 * @param {Keyboard} keyboard
 * @param {EditorActions} editorActions
 */
KeyboardBindings.prototype.registerBindings = function(keyboard, editorActions) {

  /**
   * Add keyboard binding if respective editor action
   * is registered.
   *
   * @param {string} action name
   * @param {Function} fn that implements the key binding
   */
  function addListener(action, fn) {

    if (editorActions.isRegistered(action)) {
      keyboard.addListener(fn);
    }
  }


  // undo
  // (CTRL|CMD) + Z
  addListener('undo', function(context) {

    var event = context.keyEvent;

    if (isUndo(event)) {
      editorActions.trigger('undo');

      return true;
    }
  });

  // redo
  // CTRL + Y
  // CMD + SHIFT + Z
  addListener('redo', function(context) {

    var event = context.keyEvent;

    if (isRedo(event)) {
      editorActions.trigger('redo');

      return true;
    }
  });

  // copy
  // CTRL/CMD + C
  addListener('copy', function(context) {

    var event = context.keyEvent;

    if (isCopy(event)) {
      editorActions.trigger('copy');

      return true;
    }
  });

  // paste
  // CTRL/CMD + V
  addListener('paste', function(context) {

    var event = context.keyEvent;

    if (isPaste(event)) {
      editorActions.trigger('paste');

      return true;
    }
  });

  // zoom in one step
  // CTRL/CMD + +
  addListener('stepZoom', function(context) {

    var event = context.keyEvent;

    // quirk: it has to be triggered by `=` as well to work on international keyboard layout
    // cf: https://github.com/bpmn-io/bpmn-js/issues/1362#issuecomment-722989754
    if (isKey([ '+', 'Add', '=' ], event) && isCmd(event)) {
      editorActions.trigger('stepZoom', { value: 1 });

      return true;
    }
  });

  // zoom out one step
  // CTRL + -
  addListener('stepZoom', function(context) {

    var event = context.keyEvent;

    if (isKey([ '-', 'Subtract' ], event) && isCmd(event)) {
      editorActions.trigger('stepZoom', { value: -1 });

      return true;
    }
  });

  // zoom to the default level
  // CTRL + 0
  addListener('zoom', function(context) {

    var event = context.keyEvent;

    if (isKey('0', event) && isCmd(event)) {
      editorActions.trigger('zoom', { value: 1 });

      return true;
    }
  });

  // delete selected element
  // DEL
  addListener('removeSelection', function(context) {

    var event = context.keyEvent;

    if (isKey([ 'Backspace', 'Delete', 'Del' ], event)) {
      editorActions.trigger('removeSelection');

      return true;
    }
  });
};

/**
 * BPMN 2.0 specific keyboard bindings.
 *
 * @param {Injector} injector
 */
function CreateAppendKeyboardBindings(injector) {

  this._injector = injector;
  this._keyboard = this._injector.get('keyboard', false);
  this._editorActions = this._injector.get('editorActions', false);

  if (this._keyboard) {
    this._injector.invoke(KeyboardBindings, this);
  }
}

e(CreateAppendKeyboardBindings, KeyboardBindings);

CreateAppendKeyboardBindings.$inject = [
  'injector'
];


/**
 * Register available keyboard bindings.
 *
 * @param {Keyboard} keyboard
 * @param {EditorActions} editorActions
 */
CreateAppendKeyboardBindings.prototype.registerBindings = function() {

  const keyboard = this._keyboard;
  const editorActions = this._editorActions;

  // inherit default bindings
  KeyboardBindings.prototype.registerBindings.call(this, keyboard, editorActions);

  /**
   * Add keyboard binding if respective editor action
   * is registered.
   *
   * @param {string} action name
   * @param {Function} fn that implements the key binding
   */
  function addListener(action, fn) {

    if (editorActions && editorActions.isRegistered(action)) {
      keyboard && keyboard.addListener(fn);
    }
  }

  // activate append/create element
  // A
  addListener('appendElement', function(context) {

    const event = context.keyEvent;

    if (keyboard && keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard && keyboard.isKey([ 'a', 'A' ], event)) {

      editorActions && editorActions.trigger('appendElement', event);
      return true;
    }
  });

  // N
  addListener('createElement', function(context) {

    const event = context.keyEvent;

    if (keyboard && keyboard.hasModifier(event)) {
      return;
    }

    if (keyboard && keyboard.isKey([ 'n', 'N' ], event)) {
      editorActions && editorActions.trigger('createElement', event);

      return true;
    }
  });

};

var KeyboardBindingsModule = {
  __depends__: [
    AppendMenuModule,
    CreateMenuModule
  ],
  __init__: [
    'createAppendKeyboardBindings'
  ],
  createAppendKeyboardBindings: [ 'type', CreateAppendKeyboardBindings ]
};

var index$1 = {
  __depends__: [
    AppendMenuModule,
    CreateMenuModule,
    EditorActionsModule,
    KeyboardBindingsModule
  ],
};

/**
 * A popup menu provider that allows to append elements with
 * element templates.
 */
function ElementTemplatesAppendProvider(
    popupMenu, translate, elementTemplates,
    autoPlace, create, mouse, rules) {

  this._popupMenu = popupMenu;
  this._translate = translate;
  this._elementTemplates = elementTemplates;
  this._autoPlace = autoPlace;
  this._create = create;
  this._mouse = mouse;
  this._rules = rules;

  this.register();
}

ElementTemplatesAppendProvider.$inject = [
  'popupMenu',
  'translate',
  'elementTemplates',
  'autoPlace',
  'create',
  'move',
  'rules'
];

/**
 * Register append menu provider in the popup menu
 */
ElementTemplatesAppendProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-append', this);
};

/**
 * Adds the element templates to the append menu.
 * @param {djs.model.Base} element
 *
 * @returns {Object}
 */
ElementTemplatesAppendProvider.prototype.getPopupMenuEntries = function(element) {
  return (entries) => {

    if (!this._rules.allowed('shape.append', { element: element })) {
      return [];
    }

    const filteredTemplates = this._filterTemplates(this._elementTemplates.getLatest());

    // add template entries
    assign(entries, this.getTemplateEntries(element, filteredTemplates));

    return entries;
  };
};

/**
 * Get all element templates.
 *
 * @param {djs.model.Base} element
 *
 * @return {Object} element templates as menu entries
 */
ElementTemplatesAppendProvider.prototype.getTemplateEntries = function(element, templates) {

  const templateEntries = {};

  templates.map(template => {

    const {
      icon = {},
      category,
      keywords = [],
    } = template;

    const entryId = `append.template-${template.id}`;

    const defaultGroup = {
      id: 'templates',
      name: this._translate('Templates')
    };

    templateEntries[entryId] = {
      label: template.name,
      description: template.description,
      documentationRef: template.documentationRef,
      search: keywords,
      imageUrl: icon.contents,
      group: category || defaultGroup,
      action: this._getEntryAction(element, template)
    };
  });

  return templateEntries;
};

/**
 * Filter out templates from the options.
 *
 * @param {Array<Object>} templates
 *
 * @returns {Array<Object>}
 */
ElementTemplatesAppendProvider.prototype._filterTemplates = function(templates) {
  return templates.filter(template => {
    const {
      appliesTo,
      elementType
    } = template;

    const type = (elementType && elementType.value) || appliesTo[0];

    // elements that can not be appended
    if ([
      'bpmn:StartEvent',
      'bpmn:Participant'
    ].includes(type)) {
      return false;
    }

    // sequence flow templates are supported
    // but connections are not appendable
    if ('bpmn:SequenceFlow' === type) {
      return false;
    }

    return true;
  });
};

/**
 * Create an action for a given template.
 *
 * @param {djs.model.Base} element
 * @param {Object} template
 *
 * @returns {Object}
 */
ElementTemplatesAppendProvider.prototype._getEntryAction = function(element, template) {
  return {

    click: () => {
      const newElement = this._elementTemplates.createElement(template);
      this._autoPlace.append(element, newElement);
    },

    dragstart: (event) => {
      const newElement = this._elementTemplates.createElement(template);

      if (event instanceof KeyboardEvent) {
        event = this._mouse.getLastMoveEvent();
      }

      this._create.start(event, newElement, {
        source: element
      });
    }
  };
};

var AppendElementTemplatesModule = {
  __init__: [ 'elementTemplatesAppendProvider' ],
  elementTemplatesAppendProvider: [ 'type', ElementTemplatesAppendProvider ]
};

/**
 * A popup menu provider that allows to create elements with
 * element templates.
 */
function ElementTemplatesCreateProvider(
    popupMenu, translate,
    elementTemplates, mouse, create) {

  this._popupMenu = popupMenu;
  this._translate = translate;
  this._elementTemplates = elementTemplates;
  this._mouse = mouse;
  this._create = create;

  this.register();
}

ElementTemplatesCreateProvider.$inject = [
  'popupMenu',
  'translate',
  'elementTemplates',
  'mouse',
  'create'
];

/**
 * Register create menu provider in the popup menu
 */
ElementTemplatesCreateProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-create', this);
};

/**
 * Adds the element templates to the create menu.
 * @param {djs.model.Base} element
 *
 * @returns {Object}
 */
ElementTemplatesCreateProvider.prototype.getPopupMenuEntries = function(element) {
  return (entries) => {

    // add template entries
    assign(entries, this.getTemplateEntries(element));

    return entries;
  };
};

/**
 * Get all element templates.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of element templates as menu entries
 */
ElementTemplatesCreateProvider.prototype.getTemplateEntries = function() {

  const templates = this._elementTemplates.getLatest();
  const templateEntries = {};

  templates.map(template => {

    const {
      icon = {},
      category,
      keywords = [],
    } = template;

    const entryId = `create.template-${template.id}`;

    const defaultGroup = {
      id: 'templates',
      name: this._translate('Templates')
    };

    templateEntries[entryId] = {
      label: template.name,
      description: template.description,
      documentationRef: template.documentationRef,
      imageUrl: icon.contents,
      group: category || defaultGroup,
      search: keywords,
      action: {
        click: this._getEntryAction(template),
        dragstart: this._getEntryAction(template)
      }
    };
  });

  return templateEntries;
};


ElementTemplatesCreateProvider.prototype._getEntryAction = function(template) {
  const create = this._create;
  const popupMenu = this._popupMenu;
  const elementTemplates = this._elementTemplates;
  const mouse = this._mouse;

  return (event) => {

    popupMenu.close();

    // create the new element
    let newElement = elementTemplates.createElement(template);

    // use last mouse event if triggered via keyboard
    if (event instanceof KeyboardEvent) {
      event = mouse.getLastMoveEvent();
    }

    return create.start(event, newElement);
  };
};

var CreateElementTemplatesModule = {
  __init__: [ 'elementTemplatesCreateProvider' ],
  elementTemplatesCreateProvider: [ 'type', ElementTemplatesCreateProvider ]
};

/**
 * A replace menu provider that allows to replace elements with
 * element templates.
 */
function ElementTemplatesReplaceProvider(popupMenu, translate, elementTemplates) {

  this._popupMenu = popupMenu;
  this._translate = translate;
  this._elementTemplates = elementTemplates;

  this.register();
}

ElementTemplatesReplaceProvider.$inject = [
  'popupMenu',
  'translate',
  'elementTemplates'
];

/**
 * Register replace menu provider in the popup menu
 */
ElementTemplatesReplaceProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-replace', this);
};

/**
 * Adds the element templates to the replace menu.
 * @param {djs.model.Base} element
 *
 * @returns {Object}
 */
ElementTemplatesReplaceProvider.prototype.getPopupMenuEntries = function(element) {

  return (entries) => {

    // convert our entries into something sortable
    let entrySet = Object.entries(entries);

    // add template entries
    entrySet = [ ...entrySet, ...this.getTemplateEntries(element) ];

    // convert back to object
    return entrySet.reduce((entries, [ key, value ]) => {
      entries[key] = value;

      return entries;
    }, {});
  };
};

/**
 * Get all element templates that can be used to replace the given element.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of element templates as menu entries
 */
ElementTemplatesReplaceProvider.prototype.getTemplateEntries = function(element) {

  const templates = this._getMatchingTemplates(element);
  return templates.map(template => {

    const {
      icon = {},
      category,
      keywords = [],
    } = template;

    const entryId = `replace.template-${template.id}`;

    const defaultGroup = {
      id: 'templates',
      name: this._translate('Templates')
    };

    return [ entryId, {
      label: template.name,
      description: template.description,
      documentationRef: template.documentationRef,
      imageUrl: icon.contents,
      search: keywords,
      group: category || defaultGroup,
      action: () => {
        this._elementTemplates.applyTemplate(element, template);
      }
    } ];
  });
};

/**
 * Returns the templates that can the element can be replaced with.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array<ElementTemplate>}
 */
ElementTemplatesReplaceProvider.prototype._getMatchingTemplates = function(element) {
  return this._elementTemplates.getLatest().filter(template => {
    return isAny(element, template.appliesTo) && !isTemplateApplied(element, template);
  });
};


// helpers ////////////
function isTemplateApplied(element, template) {
  const businessObject = getBusinessObject(element);

  if (businessObject) {
    return businessObject.get('zeebe:modelerTemplate') === template.id;
  }

  return false;
}

var ReplaceElementTemplatesModule = {
  __init__: [
    'elementTemplatesReplaceProvider'
  ],
  elementTemplatesReplaceProvider: [ 'type', ElementTemplatesReplaceProvider ]
};

/**
 * @typedef {import('../model/Types').Element} Element
 * @typedef {import('../model/Types').ModdleElement} ModdleElement
 */

/**
 * @param {Element} element
 * @param {ModdleElement} [di]
 *
 * @return {boolean}
 */
function isExpanded(element, di) {

  if (is(element, 'bpmn:CallActivity')) {
    return false;
  }

  if (is(element, 'bpmn:SubProcess')) {
    di = di || getDi(element);

    if (di && is(di, 'bpmndi:BPMNPlane')) {
      return true;
    }

    return di && !!di.isExpanded;
  }

  if (is(element, 'bpmn:Participant')) {
    return !!getBusinessObject(element).processRef;
  }

  return true;
}

/**
 * @typedef {import('../../../model/Types').Element} Element
 * @typedef {import('diagram-js/lib/features/popup-menu/PopupMenu').PopupMenuTarget} PopupMenuTarget
 *
 * @typedef {(entry: PopupMenuTarget) => boolean} DifferentTypeValidator
 */

/**
 * Returns true, if an element is from a different type
 * than a target definition. Takes into account the type,
 * event definition type and triggeredByEvent property.
 *
 * @param {Element} element
 *
 * @return {DifferentTypeValidator}
 */
function isDifferentType(element) {

  return function(entry) {
    var target = entry.target;

    var businessObject = getBusinessObject(element),
        eventDefinition = businessObject.eventDefinitions && businessObject.eventDefinitions[0];

    var isTypeEqual = businessObject.$type === target.type;

    var isEventDefinitionEqual = (
      (eventDefinition && eventDefinition.$type) === target.eventDefinitionType
    );

    var isTriggeredByEventEqual = (

      // coherse to <false>
      !!target.triggeredByEvent === !!businessObject.triggeredByEvent
    );

    var isExpandedEqual = (
      target.isExpanded === undefined ||
      target.isExpanded === isExpanded(element)
    );

    return !isTypeEqual || !isEventDefinitionEqual || !isTriggeredByEventEqual || !isExpandedEqual;
  };
}

/**
 * @typedef { () => string } LabelGetter
 *
 * @typedef { {
 *   label: string | LabelGetter;
 *   actionName: string;
 *   className: string;
 *   target?: {
 *     type: string;
 *     isExpanded?: boolean;
 *     isInterrupting?: boolean;
 *     triggeredByEvent?: boolean;
 *     cancelActivity?: boolean;
 *     eventDefinitionType?: string;
 *     eventDefinitionAttrs?: Record<string, any>
 *   };
 * } } ReplaceOption
 */

/**
 * @type {ReplaceOption[]}
 */
var START_EVENT = [
  {
    label: 'Start event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  {
    label: 'Intermediate throw event',
    actionName: 'replace-with-none-intermediate-throwing',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'bpmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'End event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  },
  {
    label: 'Message start event',
    actionName: 'replace-with-message-start',
    className: 'bpmn-icon-start-event-message',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer start event',
    actionName: 'replace-with-timer-start',
    className: 'bpmn-icon-start-event-timer',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition'
    }
  },
  {
    label: 'Conditional start event',
    actionName: 'replace-with-conditional-start',
    className: 'bpmn-icon-start-event-condition',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Signal start event',
    actionName: 'replace-with-signal-start',
    className: 'bpmn-icon-start-event-signal',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var START_EVENT_SUB_PROCESS = [
  {
    label: 'Start event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  {
    label: 'Intermediate throw event',
    actionName: 'replace-with-none-intermediate-throwing',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'bpmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'End event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var INTERMEDIATE_EVENT = [
  {
    label: 'Start event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  {
    label: 'Intermediate throw event',
    actionName: 'replace-with-none-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'bpmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'End event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  },
  {
    label: 'Message intermediate catch event',
    actionName: 'replace-with-message-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-message',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Message intermediate throw event',
    actionName: 'replace-with-message-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-message',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer intermediate catch event',
    actionName: 'replace-with-timer-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-timer',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition'
    }
  },
  {
    label: 'Escalation intermediate throw event',
    actionName: 'replace-with-escalation-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-escalation',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Conditional intermediate catch event',
    actionName: 'replace-with-conditional-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-condition',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Link intermediate catch event',
    actionName: 'replace-with-link-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-link',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:LinkEventDefinition',
      eventDefinitionAttrs: {
        name: ''
      }
    }
  },
  {
    label: 'Link intermediate throw event',
    actionName: 'replace-with-link-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-link',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:LinkEventDefinition',
      eventDefinitionAttrs: {
        name: ''
      }
    }
  },
  {
    label: 'Compensation intermediate throw event',
    actionName: 'replace-with-compensation-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-compensation',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Signal intermediate catch event',
    actionName: 'replace-with-signal-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-signal',
    target: {
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  },
  {
    label: 'Signal intermediate throw event',
    actionName: 'replace-with-signal-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-signal',
    target: {
      type: 'bpmn:IntermediateThrowEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var END_EVENT = [
  {
    label: 'Start event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'bpmn:StartEvent'
    }
  },
  {
    label: 'Intermediate throw event',
    actionName: 'replace-with-none-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'bpmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'End event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'bpmn:EndEvent'
    }
  },
  {
    label: 'Message end event',
    actionName: 'replace-with-message-end',
    className: 'bpmn-icon-end-event-message',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition'
    }
  },
  {
    label: 'Escalation end event',
    actionName: 'replace-with-escalation-end',
    className: 'bpmn-icon-end-event-escalation',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Error end event',
    actionName: 'replace-with-error-end',
    className: 'bpmn-icon-end-event-error',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:ErrorEventDefinition'
    }
  },
  {
    label: 'Cancel end event',
    actionName: 'replace-with-cancel-end',
    className: 'bpmn-icon-end-event-cancel',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:CancelEventDefinition'
    }
  },
  {
    label: 'Compensation end event',
    actionName: 'replace-with-compensation-end',
    className: 'bpmn-icon-end-event-compensation',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Signal end event',
    actionName: 'replace-with-signal-end',
    className: 'bpmn-icon-end-event-signal',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition'
    }
  },
  {
    label: 'Terminate end event',
    actionName: 'replace-with-terminate-end',
    className: 'bpmn-icon-end-event-terminate',
    target: {
      type: 'bpmn:EndEvent',
      eventDefinitionType: 'bpmn:TerminateEventDefinition'
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var GATEWAY = [
  {
    label: 'Exclusive gateway',
    actionName: 'replace-with-exclusive-gateway',
    className: 'bpmn-icon-gateway-xor',
    target: {
      type: 'bpmn:ExclusiveGateway'
    }
  },
  {
    label: 'Parallel gateway',
    actionName: 'replace-with-parallel-gateway',
    className: 'bpmn-icon-gateway-parallel',
    target: {
      type: 'bpmn:ParallelGateway'
    }
  },
  {
    label: 'Inclusive gateway',
    actionName: 'replace-with-inclusive-gateway',
    className: 'bpmn-icon-gateway-or',
    target: {
      type: 'bpmn:InclusiveGateway'
    }
  },
  {
    label: 'Complex gateway',
    actionName: 'replace-with-complex-gateway',
    className: 'bpmn-icon-gateway-complex',
    target: {
      type: 'bpmn:ComplexGateway'
    }
  },
  {
    label: 'Event-based gateway',
    actionName: 'replace-with-event-based-gateway',
    className: 'bpmn-icon-gateway-eventbased',
    target: {
      type: 'bpmn:EventBasedGateway',
      instantiate: false,
      eventGatewayType: 'Exclusive'
    }
  }

  // Gateways deactivated until https://github.com/bpmn-io/bpmn-js/issues/194
  // {
  //   label: 'Event based instantiating Gateway',
  //   actionName: 'replace-with-exclusive-event-based-gateway',
  //   className: 'bpmn-icon-exclusive-event-based',
  //   target: {
  //     type: 'bpmn:EventBasedGateway'
  //   },
  //   options: {
  //     businessObject: { instantiate: true, eventGatewayType: 'Exclusive' }
  //   }
  // },
  // {
  //   label: 'Parallel Event based instantiating Gateway',
  //   actionName: 'replace-with-parallel-event-based-instantiate-gateway',
  //   className: 'bpmn-icon-parallel-event-based-instantiate-gateway',
  //   target: {
  //     type: 'bpmn:EventBasedGateway'
  //   },
  //   options: {
  //     businessObject: { instantiate: true, eventGatewayType: 'Parallel' }
  //   }
  // }
];

/**
 * @type {ReplaceOption[]}
 */
var SUBPROCESS_EXPANDED = [
  {
    label: 'Transaction',
    actionName: 'replace-with-transaction',
    className: 'bpmn-icon-transaction',
    target: {
      type: 'bpmn:Transaction',
      isExpanded: true
    }
  },
  {
    label: 'Event sub-process',
    actionName: 'replace-with-event-subprocess',
    className: 'bpmn-icon-event-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      triggeredByEvent: true,
      isExpanded: true
    }
  },
  {
    label: 'Ad-hoc sub-process',
    actionName: 'replace-with-ad-hoc-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:AdHocSubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Sub-process (collapsed)',
    actionName: 'replace-with-collapsed-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'bpmn:SubProcess',
      isExpanded: false
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var AD_HOC_SUBPROCESS_EXPANDED = [
  {
    label: 'Sub-process',
    actionName: 'replace-with-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Transaction',
    actionName: 'replace-with-transaction',
    className: 'bpmn-icon-transaction',
    target: {
      type: 'bpmn:Transaction',
      isExpanded: true
    }
  },
  {
    label: 'Event sub-process',
    actionName: 'replace-with-event-subprocess',
    className: 'bpmn-icon-event-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      triggeredByEvent: true,
      isExpanded: true
    }
  },
  {
    label: 'Ad-hoc sub-process (collapsed)',
    actionName: 'replace-with-collapsed-ad-hoc-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'bpmn:AdHocSubProcess',
      isExpanded: false
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var TRANSACTION = [
  {
    label: 'Transaction',
    actionName: 'replace-with-transaction',
    className: 'bpmn-icon-transaction',
    target: {
      type: 'bpmn:Transaction',
      isExpanded: true
    }
  },
  {
    label: 'Sub-process',
    actionName: 'replace-with-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Ad-hoc sub-process',
    actionName: 'replace-with-ad-hoc-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:AdHocSubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Event sub-process',
    actionName: 'replace-with-event-subprocess',
    className: 'bpmn-icon-event-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      triggeredByEvent: true,
      isExpanded: true
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var EVENT_SUB_PROCESS = TRANSACTION;

/**
 * @type {ReplaceOption[]}
 */
var TASK = [
  {
    label: 'Task',
    actionName: 'replace-with-task',
    className: 'bpmn-icon-task',
    target: {
      type: 'bpmn:Task'
    }
  },
  {
    label: 'User task',
    actionName: 'replace-with-user-task',
    className: 'bpmn-icon-user',
    target: {
      type: 'bpmn:UserTask'
    }
  },
  {
    label: 'Service task',
    actionName: 'replace-with-service-task',
    className: 'bpmn-icon-service',
    target: {
      type: 'bpmn:ServiceTask'
    }
  },
  {
    label: 'Send task',
    actionName: 'replace-with-send-task',
    className: 'bpmn-icon-send',
    target: {
      type: 'bpmn:SendTask'
    }
  },
  {
    label: 'Receive task',
    actionName: 'replace-with-receive-task',
    className: 'bpmn-icon-receive',
    target: {
      type: 'bpmn:ReceiveTask'
    }
  },
  {
    label: 'Manual task',
    actionName: 'replace-with-manual-task',
    className: 'bpmn-icon-manual',
    target: {
      type: 'bpmn:ManualTask'
    }
  },
  {
    label: 'Business rule task',
    actionName: 'replace-with-rule-task',
    className: 'bpmn-icon-business-rule',
    target: {
      type: 'bpmn:BusinessRuleTask'
    }
  },
  {
    label: 'Script task',
    actionName: 'replace-with-script-task',
    className: 'bpmn-icon-script',
    target: {
      type: 'bpmn:ScriptTask'
    }
  },
  {
    label: 'Call activity',
    actionName: 'replace-with-call-activity',
    className: 'bpmn-icon-call-activity',
    target: {
      type: 'bpmn:CallActivity'
    }
  },
  {
    label: 'Sub-process (collapsed)',
    actionName: 'replace-with-collapsed-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'bpmn:SubProcess',
      isExpanded: false
    }
  },
  {
    label: 'Sub-process (expanded)',
    actionName: 'replace-with-expanded-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:SubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Ad-hoc sub-process (collapsed)',
    actionName: 'replace-with-collapsed-ad-hoc-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'bpmn:AdHocSubProcess',
      isExpanded: false
    }
  },
  {
    label: 'Ad-hoc sub-process (expanded)',
    actionName: 'replace-with-ad-hoc-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'bpmn:AdHocSubProcess',
      isExpanded: true
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var DATA_OBJECT_REFERENCE = [
  {
    label: 'Data store reference',
    actionName: 'replace-with-data-store-reference',
    className: 'bpmn-icon-data-store',
    target: {
      type: 'bpmn:DataStoreReference'
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var DATA_STORE_REFERENCE = [
  {
    label: 'Data object reference',
    actionName: 'replace-with-data-object-reference',
    className: 'bpmn-icon-data-object',
    target: {
      type: 'bpmn:DataObjectReference'
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var BOUNDARY_EVENT = [
  {
    label: 'Message boundary event',
    actionName: 'replace-with-message-boundary',
    className: 'bpmn-icon-intermediate-event-catch-message',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Timer boundary event',
    actionName: 'replace-with-timer-boundary',
    className: 'bpmn-icon-intermediate-event-catch-timer',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Escalation boundary event',
    actionName: 'replace-with-escalation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-escalation',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Conditional boundary event',
    actionName: 'replace-with-conditional-boundary',
    className: 'bpmn-icon-intermediate-event-catch-condition',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Error boundary event',
    actionName: 'replace-with-error-boundary',
    className: 'bpmn-icon-intermediate-event-catch-error',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:ErrorEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Cancel boundary event',
    actionName: 'replace-with-cancel-boundary',
    className: 'bpmn-icon-intermediate-event-catch-cancel',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:CancelEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Signal boundary event',
    actionName: 'replace-with-signal-boundary',
    className: 'bpmn-icon-intermediate-event-catch-signal',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Compensation boundary event',
    actionName: 'replace-with-compensation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-compensation',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:CompensateEventDefinition',
      cancelActivity: true
    }
  },
  {
    label: 'Message boundary event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-message-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-message',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Timer boundary event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-timer-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-timer',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Escalation boundary event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-escalation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-escalation',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Conditional boundary event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-conditional-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-condition',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Signal boundary event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-signal-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-signal',
    target: {
      type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition',
      cancelActivity: false
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var EVENT_SUB_PROCESS_START_EVENT = [
  {
    label: 'Message start event',
    actionName: 'replace-with-message-start',
    className: 'bpmn-icon-start-event-message',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition',
      isInterrupting: true
    }
  },
  {
    label: 'Timer start event',
    actionName: 'replace-with-timer-start',
    className: 'bpmn-icon-start-event-timer',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      isInterrupting: true
    }
  },
  {
    label: 'Conditional start event',
    actionName: 'replace-with-conditional-start',
    className: 'bpmn-icon-start-event-condition',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition',
      isInterrupting: true
    }
  },
  {
    label: 'Signal start event',
    actionName: 'replace-with-signal-start',
    className: 'bpmn-icon-start-event-signal',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition',
      isInterrupting: true
    }
  },
  {
    label: 'Error start event',
    actionName: 'replace-with-error-start',
    className: 'bpmn-icon-start-event-error',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:ErrorEventDefinition',
      isInterrupting: true
    }
  },
  {
    label: 'Escalation start event',
    actionName: 'replace-with-escalation-start',
    className: 'bpmn-icon-start-event-escalation',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition',
      isInterrupting: true
    }
  },
  {
    label: 'Compensation start event',
    actionName: 'replace-with-compensation-start',
    className: 'bpmn-icon-start-event-compensation',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:CompensateEventDefinition',
      isInterrupting: true
    }
  },
  {
    label: 'Message start event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-message-start',
    className: 'bpmn-icon-start-event-non-interrupting-message',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:MessageEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Timer start event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-timer-start',
    className: 'bpmn-icon-start-event-non-interrupting-timer',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Conditional start event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-conditional-start',
    className: 'bpmn-icon-start-event-non-interrupting-condition',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:ConditionalEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Signal start event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-signal-start',
    className: 'bpmn-icon-start-event-non-interrupting-signal',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:SignalEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Escalation start event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-escalation-start',
    className: 'bpmn-icon-start-event-non-interrupting-escalation',
    target: {
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:EscalationEventDefinition',
      isInterrupting: false
    }
  }
];

/**
 * @type {ReplaceOption[]}
 */
var SEQUENCE_FLOW = [
  {
    label: 'Sequence flow',
    actionName: 'replace-with-sequence-flow',
    className: 'bpmn-icon-connection'
  },
  {
    label: 'Default flow',
    actionName: 'replace-with-default-flow',
    className: 'bpmn-icon-default-flow'
  },
  {
    label: 'Conditional flow',
    actionName: 'replace-with-conditional-flow',
    className: 'bpmn-icon-conditional-flow'
  }
];

/**
 * @type {ReplaceOption[]}
 */
var PARTICIPANT = [
  {
    label: 'Expanded pool/participant',
    actionName: 'replace-with-expanded-pool',
    className: 'bpmn-icon-participant',
    target: {
      type: 'bpmn:Participant',
      isExpanded: true
    }
  },
  {
    label: function(element) {
      var label = 'Empty pool/participant';

      if (element.children && element.children.length) {
        label += ' (removes content)';
      }

      return label;
    },
    actionName: 'replace-with-collapsed-pool',

    // TODO(@janstuemmel): maybe design new icon
    className: 'bpmn-icon-lane',
    target: {
      type: 'bpmn:Participant',
      isExpanded: false
    }
  }
];

/**
 * @type {{ [key: string]: ReplaceOption[]}}
 */
var TYPED_EVENT = {
  'bpmn:MessageEventDefinition': [
    {
      label: 'Message start event',
      actionName: 'replace-with-message-start',
      className: 'bpmn-icon-start-event-message',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'bpmn:MessageEventDefinition'
      }
    },
    {
      label: 'Message intermediate catch event',
      actionName: 'replace-with-message-intermediate-catch',
      className: 'bpmn-icon-intermediate-event-catch-message',
      target: {
        type: 'bpmn:IntermediateCatchEvent',
        eventDefinitionType: 'bpmn:MessageEventDefinition'
      }
    },
    {
      label: 'Message intermediate throw event',
      actionName: 'replace-with-message-intermediate-throw',
      className: 'bpmn-icon-intermediate-event-throw-message',
      target: {
        type: 'bpmn:IntermediateThrowEvent',
        eventDefinitionType: 'bpmn:MessageEventDefinition'
      }
    },
    {
      label: 'Message end event',
      actionName: 'replace-with-message-end',
      className: 'bpmn-icon-end-event-message',
      target: {
        type: 'bpmn:EndEvent',
        eventDefinitionType: 'bpmn:MessageEventDefinition'
      }
    }
  ],
  'bpmn:TimerEventDefinition': [
    {
      label: 'Timer start event',
      actionName: 'replace-with-timer-start',
      className: 'bpmn-icon-start-event-timer',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'bpmn:TimerEventDefinition'
      }
    },
    {
      label: 'Timer intermediate catch event',
      actionName: 'replace-with-timer-intermediate-catch',
      className: 'bpmn-icon-intermediate-event-catch-timer',
      target: {
        type: 'bpmn:IntermediateCatchEvent',
        eventDefinitionType: 'bpmn:TimerEventDefinition'
      }
    }
  ],
  'bpmn:ConditionalEventDefinition': [
    {
      label: 'Conditional start event',
      actionName: 'replace-with-conditional-start',
      className: 'bpmn-icon-start-event-condition',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'bpmn:ConditionalEventDefinition'
      }
    },
    {
      label: 'Conditional intermediate catch event',
      actionName: 'replace-with-conditional-intermediate-catch',
      className: 'bpmn-icon-intermediate-event-catch-condition',
      target: {
        type: 'bpmn:IntermediateCatchEvent',
        eventDefinitionType: 'bpmn:ConditionalEventDefinition'
      }
    }
  ],
  'bpmn:SignalEventDefinition': [
    {
      label: 'Signal start event',
      actionName: 'replace-with-signal-start',
      className: 'bpmn-icon-start-event-signal',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'bpmn:SignalEventDefinition'
      }
    },
    {
      label: 'Signal intermediate catch event',
      actionName: 'replace-with-signal-intermediate-catch',
      className: 'bpmn-icon-intermediate-event-catch-signal',
      target: {
        type: 'bpmn:IntermediateCatchEvent',
        eventDefinitionType: 'bpmn:SignalEventDefinition'
      }
    },
    {
      label: 'Signal intermediate throw event',
      actionName: 'replace-with-signal-intermediate-throw',
      className: 'bpmn-icon-intermediate-event-throw-signal',
      target: {
        type: 'bpmn:IntermediateThrowEvent',
        eventDefinitionType: 'bpmn:SignalEventDefinition'
      }
    },
    {
      label: 'Signal end event',
      actionName: 'replace-with-signal-end',
      className: 'bpmn-icon-end-event-signal',
      target: {
        type: 'bpmn:EndEvent',
        eventDefinitionType: 'bpmn:SignalEventDefinition'
      }
    }
  ],
  'bpmn:ErrorEventDefinition': [
    {
      label: 'Error start event',
      actionName: 'replace-with-error-start',
      className: 'bpmn-icon-start-event-error',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'bpmn:ErrorEventDefinition'
      }
    },
    {
      label: 'Error end event',
      actionName: 'replace-with-error-end',
      className: 'bpmn-icon-end-event-error',
      target: {
        type: 'bpmn:EndEvent',
        eventDefinitionType: 'bpmn:ErrorEventDefinition'
      }
    }
  ],
  'bpmn:EscalationEventDefinition': [
    {
      label: 'Escalation start event',
      actionName: 'replace-with-escalation-start',
      className: 'bpmn-icon-start-event-escalation',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'bpmn:EscalationEventDefinition'
      }
    },
    {
      label: 'Escalation intermediate throw event',
      actionName: 'replace-with-escalation-intermediate-throw',
      className: 'bpmn-icon-intermediate-event-throw-escalation',
      target: {
        type: 'bpmn:IntermediateThrowEvent',
        eventDefinitionType: 'bpmn:EscalationEventDefinition'
      }
    },
    {
      label: 'Escalation end event',
      actionName: 'replace-with-escalation-end',
      className: 'bpmn-icon-end-event-escalation',
      target: {
        type: 'bpmn:EndEvent',
        eventDefinitionType: 'bpmn:EscalationEventDefinition'
      }
    }
  ],
  'bpmn:CompensateEventDefinition': [
    {
      label: 'Compensation start event',
      actionName: 'replace-with-compensation-start',
      className: 'bpmn-icon-start-event-compensation',
      target: {
        type: 'bpmn:StartEvent',
        eventDefinitionType: 'bpmn:CompensateEventDefinition'
      }
    },
    {
      label: 'Compensation intermediate throw event',
      actionName: 'replace-with-compensation-intermediate-throw',
      className: 'bpmn-icon-intermediate-event-throw-compensation',
      target: {
        type: 'bpmn:IntermediateThrowEvent',
        eventDefinitionType: 'bpmn:CompensateEventDefinition'
      }
    },
    {
      label: 'Compensation end event',
      actionName: 'replace-with-compensation-end',
      className: 'bpmn-icon-end-event-compensation',
      target: {
        type: 'bpmn:EndEvent',
        eventDefinitionType: 'bpmn:CompensateEventDefinition'
      }
    }
  ]
};

var replaceOptions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AD_HOC_SUBPROCESS_EXPANDED: AD_HOC_SUBPROCESS_EXPANDED,
  BOUNDARY_EVENT: BOUNDARY_EVENT,
  DATA_OBJECT_REFERENCE: DATA_OBJECT_REFERENCE,
  DATA_STORE_REFERENCE: DATA_STORE_REFERENCE,
  END_EVENT: END_EVENT,
  EVENT_SUB_PROCESS: EVENT_SUB_PROCESS,
  EVENT_SUB_PROCESS_START_EVENT: EVENT_SUB_PROCESS_START_EVENT,
  GATEWAY: GATEWAY,
  INTERMEDIATE_EVENT: INTERMEDIATE_EVENT,
  PARTICIPANT: PARTICIPANT,
  SEQUENCE_FLOW: SEQUENCE_FLOW,
  START_EVENT: START_EVENT,
  START_EVENT_SUB_PROCESS: START_EVENT_SUB_PROCESS,
  SUBPROCESS_EXPANDED: SUBPROCESS_EXPANDED,
  TASK: TASK,
  TRANSACTION: TRANSACTION,
  TYPED_EVENT: TYPED_EVENT
});

const ALL_OPTIONS = Object.values(replaceOptions);

function getReplaceOptionGroups() {
  return ALL_OPTIONS;
}

/**
 * A replace menu provider that allows to replace elements with
 * templates applied with the correspondent plain element.
 */
function RemoveTemplateReplaceProvider(popupMenu, translate, elementTemplates) {

  this._popupMenu = popupMenu;
  this._translate = translate;
  this._elementTemplates = elementTemplates;

  this.register();
}

RemoveTemplateReplaceProvider.$inject = [
  'popupMenu',
  'translate',
  'elementTemplates'
];

/**
 * Register replace menu provider in the popup menu
 */
RemoveTemplateReplaceProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-replace', this);
};

/**
 * Adds the element templates to the replace menu.
 * @param {djs.model.Base} element
 *
 * @returns {Object}
 */
RemoveTemplateReplaceProvider.prototype.getPopupMenuEntries = function(element) {

  return (entries) => {

    // convert our entries into something sortable
    let entrySet = Object.entries(entries);

    if (this._elementTemplates && this._elementTemplates.get(element)) {

      // add remove template option
      this.addPlainElementEntry(element, entrySet, this._translate, this._elementTemplates);
    }

    // convert back to object
    return entrySet.reduce((entries, [ key, value ]) => {
      entries[key] = value;

      return entries;
    }, {});
  };
};


/**
 * Adds the option to replace with plain element (remove template).
 *
 * @param {djs.model.Base} element
 * @param {Array<Object>} entries
 */
RemoveTemplateReplaceProvider.prototype.addPlainElementEntry = function(element, entries, translate, elementTemplates) {

  const replaceOption = this.getPlainEntry(element, entries, translate, elementTemplates);

  if (!replaceOption) {
    return;
  }

  const [
    insertIndex,
    entry
  ] = replaceOption;

  // insert remove entry
  entries.splice(insertIndex, 0, [ entry.id, entry ]);
};

/**
 * Returns the option to replace with plain element and the index where it should be inserted.
 *
 * @param {djs.model.Base} element
 * @param {Array<Object>} entries
 *
 * @returns {Array<Object, number>}
 */
RemoveTemplateReplaceProvider.prototype.getPlainEntry = function(element, entries, translate, elementTemplates) {

  const {
    options,
    option,
    optionIndex
  } = findReplaceOptions(element) || { };

  if (!options) {
    return null;
  }

  const entry = {
    id: 'replace-remove-element-template',
    action: () => {
      elementTemplates.removeTemplate(element);
    },
    label: translate(option.label),
    className: option.className
  };

  // insert after previous option, if it exists
  const previousIndex = getOptionIndex(options, optionIndex - 1, entries);

  if (previousIndex) {
    return [
      previousIndex + 1,
      entry
    ];
  }

  // insert before next option, if it exists
  const nextIndex = getOptionIndex(options, optionIndex + 1, entries);

  if (nextIndex) {
    return [
      nextIndex,
      entry
    ];
  }

  // fallback to insert at start
  return [
    0,
    entry
  ];
};


/**
 * @param {ModdleElement} element
 *
 * @return { { options: Array<any>, option: any, optionIndex: number } | null }
 */
function findReplaceOptions(element) {

  const isSameType = (element, option) => option.target && !isDifferentType(element)(option);

  return getReplaceOptionGroups().reduce((result, options) => {

    if (result) {
      return result;
    }

    const optionIndex = options.findIndex(option => isSameType(element, option));

    if (optionIndex === -1) {
      return;
    }

    return {
      options,
      option: options[optionIndex],
      optionIndex
    };
  }, null);
}

function getOptionIndex(options, index, entries) {
  const option = options[index];

  if (!option) {
    return false;
  }

  return entries.findIndex(
    ([ key ]) => key === option.actionName
  );
}

var RemoveTemplatesModule = {
  __init__: [ 'removeTemplateReplaceProvider' ],
  removeTemplateReplaceProvider: [ 'type', RemoveTemplateReplaceProvider ]
};

var index = {
  __depends__: [
    AppendElementTemplatesModule,
    CreateElementTemplatesModule,
    ReplaceElementTemplatesModule,
    RemoveTemplatesModule
  ]
};

// exports.CreateAppendAnythingModule = index$1;
// exports.CreateAppendElementTemplatesModule = index;
// exports.RemoveTemplatesModule = RemoveTemplatesModule;
var CreateAppendAnythingModule = index$1;
var CreateAppendElementTemplatesModule = index;
var RemoveTemplatesModule = RemoveTemplatesModule;
