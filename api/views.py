from django.http import JsonResponse
from shopify_app.decorators import session_token_required

import shopify
import json
import openai


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

    chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    messages.append(chat_completion.choices[0].message)
    # messages.append({ 'role': 'assistant', 'content': 'One sec...'})
    return JsonResponse(messages, safe=False)

