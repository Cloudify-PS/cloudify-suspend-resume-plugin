/**
 * Created by Tamer on 02/01/2018.
 */

/**
 * @class Actions
 */
export default class Actions {
  /**
   * Creates an instance of Actions.
   * 
   * @param {object} 
   * @memberof Actions
   * @access public
   */
  constructor(o) {
    this.toolbox = o.toolbox;
    this.deploymentId = o.deploymentId;
    this.nodeType = o.nodeType;
  }

  
  doGetNode() {
    let deploymentId = this.deploymentId;
    let _includes = 'id,deployment_id,blueprint_id,type,type_hierarchy,number_of_instances,host_id,relationships,created_by,properties';
    return this.toolbox.getManager().doGet(`/nodes?deployment_id=${deploymentId}&_include=${_includes}`);
  }

  // TODO: filter by type_hierarchy
  doFilterNode(data) {
    return data.items.find(item => item.type_hierarchy.some(e => e === this.nodeType));
    // return data.items.find(item => item.type === this.nodeType);
  }
  

  doGetNodeInstances() {
    let deploymentId = this.deploymentId;
    let _includes = 'id,node_id,deployment_id,state,relationships,runtime_properties,version,node_id';
    return this.toolbox.getManager().doGet(`/node-instances?deployment_id=${deploymentId}&_include=${_includes}`);
  }


  doFilterNodeInstance(data, nodeId){
    return data.items.find(item => item.node_id === nodeId);
  }
  

  doSetNodeInstances(instanceId, data) {
    let deploymentId = this.deploymentId;
    return this.toolbox.getManager().doPatch(`/node-instances/${instanceId}?deployment_id=${deploymentId}`, null, data);
  }
}
