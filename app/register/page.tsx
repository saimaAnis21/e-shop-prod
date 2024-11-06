import { getCurrentUser } from "../../actions/getCurrentUser";
import Container from "../components/Container"
import FormWrap from "../components/FormWrap"
import RegisterForm from "./RegisterForm"

const page = async () => {
  const currentUser = await getCurrentUser();
  return (
    <Container>
      <FormWrap>
        <RegisterForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
}

export default page
