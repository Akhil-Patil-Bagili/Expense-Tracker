# dynamic_cors_middleware.py

class DynamicCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        origin = request.META.get('HTTP_ORIGIN', '')

        if ".netlify.app" in origin or origin in ["http://localhost:3000"]:
            response["Access-Control-Allow-Origin"] = origin
            response["Vary"] = "Origin"

        return response
