
export function getUrl(path:string){
    if(path.startsWith("/")) return `${process.env.BACKEND}${path}`
    return `${process.env.BACKEND}/${path}`
}