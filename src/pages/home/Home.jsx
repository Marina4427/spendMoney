import { useEffect } from "react";

import "./style.css";
import { getProducts } from "../../redux/reducers/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  removeProduct,
  clearBasket,
} from "../../redux/reducers/basketSlice";
import { logout } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import AnimatedMoney from "../../components/animatedMoney/AnimatedMoney";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, error, status } = useSelector((store) => store.products);
  const { basket } = useSelector((store) => store.basket);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearBasket());
  };

  return (
    <section className="home">
      <div className="container">
        {user ? (
          <div className="btn-container">
            <span className="user__name"> Hi, {user.name} </span>
            <div className="btn-auth" onClick={() => handleLogout()}>
              Logout
            </div>
          </div>
        ) : (
          <div className="btn-auth" onClick={() => navigate("/auth")}>
            Sign In
          </div>
        )}
        <div className="img__container">
          <img className="home__img" src="/billgates.jpg" alt="Bill Gates." />
        </div>
        <h1 className="home__title title-1"> Spend Bill Gates' Money </h1>
        <AnimatedMoney
          targetValue={
            100000000000 -
            basket.reduce((acc, rec) => acc + rec.price * rec.count, 0)
          }
        />

        {status === "loading" ? (
          <h2>Loading...</h2>
        ) : status === "error" ? (
          <h2>{error}</h2>
        ) : (
          <div className="home__row">
            {products.map((item) => (
              <div key={item.id} className="home__card">
                <img
                  src={item.images[0]}
                  className="home__card-img"
                  alt={item.title}
                />

                <h3 className="home__card-title">{item.title}</h3>
                <p className="home__card-price">{item.price} $</p>

                <div className="home__card-action">
                  <button
                    className={`home__card-btn home__card-btn-sell ${
                      basket.find((el) => el.id === item.id)?.count > 0
                        ? "home__card-btn-sell-active"
                        : ""
                    }`}
                    onClick={() => {
                      const itemInBasket = basket.find(
                        (el) => el.id === item.id
                      );
                      if (itemInBasket) dispatch(removeProduct(item));
                    }}
                  >
                    sell
                  </button>
                  <span className="home__card-count">
                    {" "}
                    {basket.find((el) => el.id === item.id)?.count || 0}
                  </span>
                  <button
                    className="home__card-btn home__card-btn-buy"
                    onClick={() => {
                      dispatch(addProduct(item));
                    }}
                  >
                    buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="receipt">
          <h2 className="title-2"> Your Receipt</h2>
          <ul className="receipt__list">
            {basket.map((item) => (
              <li className="receipt__item">
                <span className="receipt__item-title">{item.title}</span>
                <span className="receipt__item-count">x{item.count}</span>
                <span className="receipt__item-price">
                  {item.price * item.count} $
                </span>
              </li>
            ))}
          </ul>

          <div className="receipt__total title-2">
            <span>Total : </span>
            <span className="total__price">
              {basket.reduce((acc, rec) => {
                return acc + rec.price * rec.count;
              }, 0)}{" "}
              $
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
