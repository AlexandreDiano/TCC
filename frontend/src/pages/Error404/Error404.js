import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import history from "~/routes/history";
import { Margin, Button } from "~/components/elements";
import { Container, Text404 } from "./styles";
import { scrollTop } from "~/utils/tools";

export default function Error404() {
  const dispatch = useDispatch();

  const handleClick = () => {
    history.push("/");
  };

  useEffect(() => {
    scrollTop();
  }, [dispatch]);
  return (
    <>
      <Container>
        <Text404>
          Essa página não existe ou não foi encontrada.
          <br />
          :( <br /> <br />
          Tente novamente.
        </Text404>
        <Margin mt={5}>
          <Button size="large" onClick={handleClick}>
            Voltar à dashboard
          </Button>
        </Margin>
      </Container>
    </>
  );
}
