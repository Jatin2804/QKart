import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `https://qkart-frontend-51uu.onrender.com:8082/api/v1`
};

function App() {
  return (
    <div className="App">
        <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/thanks" component={Thanks} />
        <Route path="/" component={Products} />
      </Switch>
    </div>
  );
}

export default App;
