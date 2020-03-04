import axios from 'axios'

const poster = async post => 
{
    const url = post.url
    const req = post.content
    const res = await axios.post(url, req)
    return res.data
}

const getter = async get =>
{
    const url = get.url
    const res = await axios.get(url)
    return res.data
}

const deleter = async del => 
{
    const url = del.url
    const req = del.content
    const res = await axios.delete(url, req)
    return res.data
}

const pusher = async push =>
{
    const url = push.url
    const req = push.content
    const res = await axios.get(url, req)
    return res.data
}

const putter = async put =>
{
    const url = put.url
    const req = put.content
    const res = await axios.put(url, req)
    return res.data
}

export default { deleter, poster, pusher, getter, putter }