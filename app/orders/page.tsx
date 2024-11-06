import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import NullData from "../components/NullData";
import OrderClient from "./OrderClient";
import getOrdersByUserId from "../../actions/getOrdersByUserId";

const Orders = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <NullData title="Oops Access denied" />;
  }
  const orders = await getOrdersByUserId(currentUser.id);

  if (!orders) {
    return <NullData title="No orders yet..." />;
  }
  return (
    <div className="pt-8">
      <Container>
        <OrderClient orders={orders} />
      </Container>
    </div>
  );
};

export default Orders;
