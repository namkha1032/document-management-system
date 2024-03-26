export default function randomString() {
    const result = Math.random().toString(36).substring(2, 7);
    return result
}