from cloudify.exceptions import NonRecoverableError


class Values(object):
    OK = 'OK'
    FAILED = 'FAILED'
    SKIPPED = 'SKIPPED'

WAITING = 'WAITING'

RUNTIME_PROPERTY = 'runtime_property'


def suspend(ctx,
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

    runtime_property = ctx.node.properties[RUNTIME_PROPERTY]
    value = runtime_props.get(runtime_property)
    if value:
        runtime_props[WAITING] = False
        if value == Values.SKIPPED:
            ctx.logger.info("Polling received SKIPPED status. Skipping.")
            return
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
              value,
              **kwargs):
    runtime_property = ctx.node.properties[RUNTIME_PROPERTY]
    ctx.instance.runtime_properties[runtime_property] = value
    ctx.logger.debug('Runtime properties: {}'
                     .format(str(ctx.instance.runtime_properties)))


def fail(ctx,
         **kwargs):
    set_value(ctx, Values.FAILED, **kwargs)


def skip(ctx,
         **kwargs):
    set_value(ctx, Values.SKIPPED, **kwargs)


def resume(ctx,
           **kwargs):
    set_value(ctx, Values.OK, **kwargs)




