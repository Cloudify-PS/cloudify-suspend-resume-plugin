import time

from cloudify import ctx
from cloudify.exceptions import NonRecoverableError


class Values(object):
    OK = 'OK'
    FAILED = 'FAILED'

WAITING = 'WAITING'


def suspend(runtime_property,
            retry_interval,
            **kwargs):
    """
    Active polling on the runtime property
    :parameter: retry_interval in seconds
    """
    ctx.instance.runtime_properties[WAITING] = True
    ctx.logger.info('Runtime properties: {}'
                    .format(str(ctx.instance.runtime_properties)))
    while WAITING and ctx.instance.runtime_properties.get(runtime_property):
        value = ctx.instance.runtime_properties.get(runtime_property)
        if value == Values.OK:
            ctx.logger.info("Polling received OK status. Operation succeeded.")
            ctx.instance.runtime_properties[WAITING] = False
            return
        elif value == Values.FAILED:
            ctx.instance.runtime_properties[WAITING] = False
            raise NonRecoverableError("Polling received FAILED status. "
                                      "Operation failed.")
        else:
            ctx.instance.runtime_properties[WAITING] = False
            raise NonRecoverableError("Unknown status '{}'. Operation failed."
                                      .format(value))
    else:
        msg = "No status received. " \
              "Retrying polling after {} seconds.".format(retry_interval)
        ctx.operation.retry(message=msg,
                            retry_after=retry_interval)


def set_value(runtime_property,
              set_value,
              **kwargs):
    ctx.instance.runtime_properties[runtime_property] = set_value
    ctx.logger.info('Runtime properties: {}'
                    .format(str(ctx.instance.runtime_properties)))


def fail(runtime_property,
         **kwargs):
    set_value(runtime_property, Values.FAILED, **kwargs)


def resume(runtime_property,
           **kwargs):
    set_value(runtime_property, Values.OK, **kwargs)




