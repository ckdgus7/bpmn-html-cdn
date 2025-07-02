export default function CustomPropertiesProvider(propertiesPanel, translate) {
  this.getGroups = function (element) {
    return function (groups) {
      const businessObject = element.businessObject;

      // Task만 대상으로 적용
      if (businessObject.$type !== 'bpmn:Task') return groups;

      // custom group 추가
      groups.push({
        id: 'custom',
        label: 'Custom Properties',
        entries: [
          {
            id: 'taskType',
            description: 'Custom task type',
            html: '<input id="custom-taskType" type="text" />',
            set: function (element, values) {
              businessObject.taskType = values.taskType;
              return { taskType: values.taskType };
            },
            get: function () {
              return { taskType: businessObject.taskType };
            }
          },
          {
            id: 'apiEndpoint',
            description: 'API Endpoint',
            html: '<input id="custom-apiEndpoint" type="text" />',
            set: function (element, values) {
              businessObject.apiEndpoint = values.apiEndpoint;
              return { apiEndpoint: values.apiEndpoint };
            },
            get: function () {
              return { apiEndpoint: businessObject.apiEndpoint };
            }
          }
        ]
      });

      return groups;
    };
  };

  propertiesPanel.registerProvider(500, this);
}
CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate'];
