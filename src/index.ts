export default {
	async fetch(request: Request) {
	  try {
		function addHeaders(response: Response) {
		  response.headers.set("Access-Control-Allow-Origin", "*");
		  response.headers.set("Access-Control-Allow-Credentials", "true");
		  response.headers.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
		  response.headers.set(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		  );
		}
  
		const url = new URL(request.url);
  
		if (url.pathname === "/") {
		  return new Response("", { status: 418 });
		}
  
		let proxyUrl;
		try {
		  proxyUrl = new URL(atob(url.pathname.slice(1)));
		} catch (error) {
		  return new Response("", { status: 418 });
		}
  
		let response;
		if (request.method == "OPTIONS") {
		  response = new Response("");
		  addHeaders(response);
		  return response;
		}
  
		response = await fetch(proxyUrl, {
		  method: request.method,
		  headers: request.headers,
		  redirect: "follow",
		  body: request.body,
		});
  
		response = new Response(response.body, response);
		addHeaders(response);
  
		return response;
	  } catch {
		return new Response("", { status: 500 });
	  }
	},
  };
  