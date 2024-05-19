// let endpoint = "https://c24a-116-110-41-178.ngrok-free.app"
let endpoint = "http://127.0.0.1:8000"
// let endpoint = "http://ec2-13-213-73-236.ap-southeast-1.compute.amazonaws.com"
let originHeader = endpoint.includes("8000") ? {} : {
    "ngrok-skip-browser-warning": "69420"
}
export default endpoint
export { originHeader }