# dynamic_cors_middleware.py

class DynamicCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        origin = request.META.get('HTTP_ORIGIN', '')

        # Check if the origin is allowed
        if ".netlify.app" in origin or origin in ["http://localhost:3000"]:
            response["Access-Control-Allow-Origin"] = origin
            response["Vary"] = "Origin"

            # Handle OPTIONS request for preflight
            if request.method == "OPTIONS":
                response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
                response["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
                response["Access-Control-Max-Age"] = "86400"  # 24 hours

        return response
