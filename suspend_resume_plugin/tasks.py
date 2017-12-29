from cloudify.exceptions import NonRecoverableError


class Values(object):
    OK = 'OK'
    FAILED = 'FAILED'

WAITING = 'WAITING'


def suspend(ctx,
            runtime_property,
            retry_interval,
            **kwargs):
    """
    Active polling on the runtime property
    :parameter: retry_interval in seconds
    """

    runtime_props = ctx.instance.runtime_properties

    runtime_props[WAITING] = True
    ctx.logger.debug('Runtime properties: {}'
                    .format(str(runtime_props)))

    value = runtime_props.get(runtime_property)
    if value:
        runtime_props[WAITING] = False
        if value == Values.OK:
            ctx.logger.info("Polling received OK status. Operation succeeded.")
            return
        if value == Values.FAILED:
            raise NonRecoverableError("Polling received FAILED status. "
                                      "Operation failed.")
        raise NonRecoverableError("Unknown status '{}'. Operation failed."
                                  .format(value))
    else:
        msg = "No status received. " \
              "Retrying polling after {} seconds.".format(retry_interval)
        ctx.operation.retry(message=msg,
                            retry_after=retry_interval)


def set_value(ctx,
              runtime_property,
              value,
              **kwargs):
    ctx.instance.runtime_properties[runtime_property] = value
    ctx.logger.debug('Runtime properties: {}'
                    .format(str(ctx.instance.runtime_properties)))


def fail(ctx,
         runtime_property,
         **kwargs):
    set_value(ctx, runtime_property, Values.FAILED, **kwargs)


def resume(ctx,
           runtime_property,
           **kwargs):
    set_value(ctx, runtime_property, Values.OK, **kwargs)




