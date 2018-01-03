/**
 * Created by Tamer on 02/01/2018.
 */

/**
 * @class List
 * @extends {Component}
 */
export default class List extends React.Component {
  /**
   * Creates an instance of List.
   * @param {any} props 
   * @param {any} context 
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false
    };
  }

  triggerActions(type) {

    this.setState({ loading: true })
    let runtime_property = this.props.node.properties.runtime_property;

    this.props.actions.doSetNodeInstances(this.props.nodeInstance.id, {
      version: this.props.nodeInstance.version++,
      runtime_properties: {
        [runtime_property]: type
      }
    }).then(resp => {
      console.log('button trigger', type, resp)
      this.setState({ loading: false })
      this.props.toolbox.refresh();
    })
  }

  /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
  render() {

    const { Grid, Button } = Stage.Basic;

    let { description, runtime_property } = this.props.node.properties;
    let value = this.props.nodeInstance.runtime_properties[runtime_property];
    let notWaiting = !this.props.nodeInstance.runtime_properties['WAITING'];

    return <Grid celled='internally'>
      <Grid.Row>
        <Grid.Column width={8}>
          {description}
        </Grid.Column>
        <Grid.Column width={3}>
          {
            this.state.loading 
            ? <Stage.Basic.Loading /> 
            : <div>{runtime_property} : {value?value:'Pending'}</div>
          }
        </Grid.Column>
        <Grid.Column width={5}>
          <Button size="tiny" color="green" onClick={this.triggerActions.bind(this, 'OK')} disabled={notWaiting}>Proceed</Button>
          <Button size="tiny" color="red" onClick={this.triggerActions.bind(this, 'FAILED')} disabled={notWaiting}>Fail</Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>;
  }
}
