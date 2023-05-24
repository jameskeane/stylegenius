from django.http import JsonResponse
from shopify_app.decorators import session_token_required

import shopify
import json


@session_token_required
def products(request):
    products = shopify.Product.find()

    return JsonResponse([p.to_dict() for p in products], safe=False)


@session_token_required
def orders(request):
    orders = shopify.Order.find(status='any')

    return JsonResponse({'orders': [o.to_dict() for o in orders]})

@session_token_required
def chat(request):
    messages = json.loads(request.body)
    messages.append({ 'role': 'assistant', 'content': 'One sec...'})
    return JsonResponse(messages, safe=False)

