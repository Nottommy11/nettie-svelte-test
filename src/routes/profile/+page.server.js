// export const load = async (serverLoadEvent) => {
// 	//this is a sever load function that runs on the server
// 	//server load function is more secured but can only return values that can be serialized
// 	console.log('load function page.server.js');
// 	const { fetch } = serverLoadEvent; //sveltekits fetch function
// 	const title = 'List of available products';
// 	const response = await fetch('http://localhost:4000/products'); //fetches data from the json server
// 	const products = await response.json();
// 	return {
// 		title,
// 		products
// 	};
// };