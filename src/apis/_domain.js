// let endpoint = "https://524e-2402-800-6371-a6bd-a5cd-1045-7178-9cae.ngrok-free.app"
let endpoint = "http://127.0.0.1:8000"
let originHeader = endpoint.includes("8000") ? {} : {
    "ngrok-skip-browser-warning": "69420"
}
export default endpoint
export { originHeader }