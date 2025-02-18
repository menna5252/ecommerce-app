import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/UserStore";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useUserStore();

    async function getOrders() {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(
                'https://ecommerce.routemisr.com/api/v1/orders/user/',
                {
                    headers: { token }
                }
            );
            setOrders(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            getOrders();
        }
    }, [token]);

    if (error) {
        return <div className="text-center text-red-600 mt-5">{error}</div>;
    }

    return (
        <>
            <h2 className="text-center text-green-800 mt-5">User Orders</h2>

            {
                orders.length == 0 && <div className="my-5">
                    <h2 className="my-5 text-center text-green-600">No Pending Orders</h2>
                </div>
            }

            {
                isLoading ? <div>Loading...</div> :
                    <div className="flex">
                        {
                            orders.map((p) => {
                                return <div key={p.id} className="bg-white p-5 m-5 rounded-md shadow-md mx-auto">
                                    <h2 className="text-lg text-gray-800">User Name: {p?.user?.name}</h2>
                                    <p className="text-lg text-gray-800">shippingPrice: {p?.shippingPrice}</p>
                                    <p className="text-sm text-gray-600">taxPrice: {p?.taxPrice}</p>
                                    <p className="text-sm text-gray-600">totalOrderPrice: {p?.totalOrderPrice}</p>
                                    <p className="text-sm text-gray-600">No. of CartItems: {p?.cartItems?.length}</p>
                                </div>
                            })
                        }
                    </div >
            }
        </>
    )
}