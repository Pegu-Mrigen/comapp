import Layout from "../components/Layout";
import { useContext } from "react";
import { ProductsContext } from "../components/ProductsContext";
import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);

  const [productsInfos, setProductsInfos] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const uniIds = [...new Set(selectedProducts)];
    fetch("/api/products?ids=" + uniIds.join(","))
      .then((response) => response.json())
      .then((json) => setProductsInfos(json));
  }, [selectedProducts]);

  // <Layout>{selectedProducts.join(",")}</Layout>;

  function moreProduct(id) {
    setSelectedProducts((prev) => [...prev, id]);
  }
  function lessProduct(id) {
    const pos = selectedProducts.indexOf(id);
    if (pos !== 5) {
      // const newSelectedProducts = selectedProducts.filter(
      //   (value, index) => index !== pos
      // );
      // setSelectedProducts(newSelectedProducts);
      setSelectedProducts((prev) => {
        return prev.filter((value, index) => index !== pos);
      });
    }
  }

  //console.log(name, email, address, city);

  let subtotal = 0;
  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInfos.find((p) => p._id === id)?.price || 0;
      subtotal += price;
    }
  }

  const deliveryPrice = 20;

  const total = subtotal + deliveryPrice;
  return (
    <Layout>
      {!selectedProducts.length && <div>No products in your cart</div>}
      {/* console.log({productsInfos.length}) */}
      {selectedProducts.length !== 0 &&
        productsInfos.map((productInfo) => {
          const numbersOfItems = selectedProducts.filter(
            (id) => id === productInfo._id
          ).length;
          if (numbersOfItems === 0) return;
          return (
            <div key={productInfo._id} className="flex mb-5">
              <div className="bg-gray-100 p-3 rounded-xl shrink-0">
                <Image
                  src={productInfo.picture}
                  alt=""
                  width={120}
                  height={120}
                ></Image>
              </div>
              <div className="pl-4">
                <h3 className="font-bold text-lg">{productInfo.name}</h3>
                <p className="text-sm leading-4 text-gray-500">
                  {productInfo.description}
                </p>
                <div className="flex">
                  <div className="grow">RS/- {productInfo.price}</div>
                  <div>
                    <button
                      onClick={() => lessProduct(productInfo._id)}
                      className=" bg-emerald-400 px-2 rounded-lg text-white"
                    >
                      -
                    </button>
                    <span className="px-2">
                      {
                        selectedProducts.filter((id) => id === productInfo._id)
                          .length
                      }
                    </span>
                    <button
                      onClick={() => moreProduct(productInfo._id)}
                      className=" bg-emerald-400 px-2 rounded-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <form action="/api/checkout" method="POST">
        <div className="mt-4">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Your name"
            name="name"
          />
          <input
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Street address"
            name="address"
          />
          <input
            onChange={(e) => setCity(e.target.value)}
            value={city}
            className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="City and postal address"
            name="city"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2"
            type="text"
            placeholder="Email address"
            name="email"
          />
        </div>
        <div className="mt-4">
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
            <h3 className="font-bold">Rs/- {subtotal}</h3>
          </div>
          <div className="flex my-3">
            <h3 className="grow font-bold text-gray-400">Delivery:</h3>
            <h3 className="font-bold">Rs/- {deliveryPrice}</h3>
          </div>
          <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
            <h3 className="grow font-bold text-gray-400">Total:</h3>
            <h3 className="font-bold">Rs/- {total}</h3>
          </div>
        </div>

        <input
          type="hidden"
          name="products"
          value={selectedProducts.join(",")}
        />
        <button className="bg-emerald-500 px-5 py-2  text-white w-full font-bold my-4 rounded-xl shadow-emerald-400 shadow-lg">
          Pay Rs/- {total}
        </button>
      </form>
    </Layout>
  );
}
