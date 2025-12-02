import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:4000/api",
    timeout: 10000
})

export const useGetOled = async (id: string) => {
    try {
        const result = await api.get(`/device/oled/${id}`);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}