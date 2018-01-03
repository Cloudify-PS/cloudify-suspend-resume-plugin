/**
 * Created by Tamer on 02/01/2018.
 */

import Actions from './Actions'
import List from './List'

Stage.defineWidget({
  id: 'suspend-resume',
  name: 'Suspend Resume',
  description: 'Suspend Resume',
  initialWidth: 12,
  initialHeight: 8,
  color: 'purple',
  hasStyle: true,
  isReact: true,

  permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
  categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

  initialConfiguration: [
    Stage.GenericConfig.POLLING_TIME_CONFIG(5),
    { id: 'deploymentId', name: 'Deployment Id', default: 'suspend-resume', type: Stage.Basic.GenericField.STRING },
    { id: 'nodeType', name: 'node Type', default: 'cloudify.nodes.AttributePoller', type: Stage.Basic.GenericField.STRING },
  ],

  fetchData(widget, toolbox, params) {
    let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;
    let actions = new Actions(Object.assign({ toolbox }, widget.configuration, { deploymentId }));

    return Promise.all([
      actions.doGetNode(),
      actions.doGetNodeInstances()
    ]);
  },

  render: function (widget, data, error, toolbox) {
    if (_.isEmpty(data)) {
      return <Stage.Basic.Loading />;
    }

    let deploymentId = toolbox.getContext().getValue('deploymentId') || widget.configuration.deploymentId;
    let actions = new Actions(Object.assign({ toolbox }, widget.configuration, { deploymentId }));

    let node = actions.doFilterNode(data[0]);
    let nodeInstance = actions.doFilterNodeInstance(data[1], node.id);

    console.log('node is', node);
    console.log('nodeInstances is', nodeInstance);

    return (
      <List
        widget={widget}
        node={node}
        nodeInstance={nodeInstance}
        toolbox={toolbox}
        actions={actions}
      />
    );
  }
});