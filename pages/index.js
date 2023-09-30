import Image from "next/image";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { initMongoose } from "../lib/mongoose";
import { findAllProducts } from "./api/products";
import Footer from "../components/Footer";
import Layout from "../components/Layout";

//CLIENT SIDE RENDERING

// export default function Home() {
//   const [productsInfo, setProductsInfo] = useState([]);
//   const [phrase, setPhrase] = useState("");

//   //console.log(phrase)

//   useEffect(() => {
//     fetch("/api/products")
//       .then((response) => response.json())
//       .then((json) => setProductsInfo(json));
//   }, []);
//   // console.log(productsInfo);

//   // const categoriesNames=(productsInfo.map(p=>p.category)
//   // const categoriesNames=new Set(productsInfo.map(p=>p.category))
//   const categoriesNames = [...new Set(productsInfo.map((p) => p.category))];

//   //console.log(categoriesNames);

//   let filteredProducts;

//   if (phrase) {
//     filteredProducts = productsInfo.filter((p) =>
//       p.name.toLowerCase().includes(phrase)
//     );
//   } else {
//     filteredProducts = productsInfo;
//   }

//   return (
//     <div className="p-5">
//       <input
//         value={phrase}
//         onChange={(e) => setPhrase(e.target.value)}
//         type="text"
//         placeholder="Search for Products..."
//         className="bg-gray-100 w-full py-2 px-4 rounded-xl"
//       />
//       <div>
//         {categoriesNames.map((c) => (
//           <div key={c}>
//             {filteredProducts.find((p) => p.category === c) && (
//               <div>
//                 <h2 className="text-2xl capitalize py-5">{c}</h2>
//                 <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
//                   {filteredProducts
//                     .filter((p) => p.category === c)
//                     .map((product) => (
//                       <div key={product._id} className="px-5 snap-start">
//                         <Product {...product} />
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

//SERVER SIDE RENDERING

export default function Home({ products }) {
  const [phrase, setPhrase] = useState("");

  const categoriesNames = [...new Set(products.map((p) => p.category))];

  if (phrase) {
    products = products.filter((p) => p.description.toLowerCase().includes(phrase));
  }

  return (
    <Layout className="p-5">
      <input
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        type="text"
        placeholder="Search for Products..."
        className="bg-gray-100 w-full py-2 px-4 rounded-xl"
      />
      <div>
        {categoriesNames.map((c) => (
          <div key={c}>
            {products.find((p) => p.category === c) && (
              <div>
                <h2 className="text-2xl capitalize py-5">{c}</h2>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  {products
                    .filter((p) => p.category === c)
                    .map((product) => (
                      <div key={product._id} className="px-5 snap-start">
                        <Product {...product} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await initMongoose();

  const products = await findAllProducts();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
