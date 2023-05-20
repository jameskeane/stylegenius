# Load or proxy react app
# Borrowed from: https://fractalideas.com/blog/making-react-and-django-play-well-together-hybrid-app-model/
import urllib.request
from django.conf import settings
from django.template import engines
from django.http import HttpResponse, StreamingHttpResponse
from django.views.generic import TemplateView
import ssl
from shopify_app.decorators import known_shop_required, latest_access_scopes_required
from django.views.decorators.clickjacking import xframe_options_exempt
from django.apps import apps


@xframe_options_exempt
@known_shop_required
def render_html(request, response, *args, **kwargs):
    response_text = response.read().decode()
    content_type = response.getheader('Content-Type')
    response.close()

    return HttpResponse(
        engines['django'].from_string(response_text).render({
            'app_config': {
                "shopOrigin": kwargs.get("shopify_domain"),
                "host": request.GET.get('host', kwargs.get("shopify_domain")),
                "apiKey": apps.get_app_config("shopify_app").SHOPIFY_API_KEY,
            }
        }),
        content_type=content_type,
        status=response.status,
        reason=response.reason,
    )


def iter_response(response, chunk_size=65536):
    try:
        while True:
            data = response.read(chunk_size)
            if not data:
                break
            yield data
    finally:
        response.close()

def catchall_dev(request, upstream='https://localhost:5000', *args, **kwargs):
    upstream_url = upstream + request.path

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    response = urllib.request.urlopen(upstream_url, context=ctx)

    content_type = response.getheader('Content-Type')
    if content_type.startswith('text/html'):
        return render_html(request, response, *args, **kwargs)
    else:
        return StreamingHttpResponse(
            iter_response(response),
            content_type=content_type,
            status=response.status,
            reason=response.reason,
        )


catchall_prod = TemplateView.as_view(template_name='index.html')

loader = catchall_dev if settings.DEBUG else catchall_prod
