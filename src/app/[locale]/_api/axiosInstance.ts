import axios from 'axios'
const BASE_URL = process.env.API_URL
const axiosInstance = axios.create({
    baseURL: BASE_URL
})

export async function getServerSideProps(context: any) {
    // Get the locale from the request context or any other source
    const locale = context.locale || 'en-US';
    console.log('context', context)
    // Make an HTTP request with Axios and set the "Accept-Language" header
    // const { data } = await axiosInstance.get('/api/data', {
    //   headers: {
    //     'Accept-Language': locale,
    //   },
    //  });

    // return {
    //     props: {
    //         data,
    //     },
    // };
}

export {axiosInstance, BASE_URL}    