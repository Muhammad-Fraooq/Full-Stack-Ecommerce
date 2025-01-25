import { createClient } from "@sanity/client";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-08-31", // Match with your API version
});

// Upload image to Sanity
async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload("image", buffer, {
      filename: imageUrl.split("/").pop(),
    });
    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error("Failed to upload image:", imageUrl, error);
    return null;
  }
}
// Function to generate a random discount
function getRandomDiscount(min = 5, max = 50) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Import data into Sanity
async function importData() {
  try {
    console.log("Fetching products from API...");
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;
    console.log(`Fetched ${products.length} products`);

    for (const product of products) {
      console.log(`Processing product: ${product.title}`);

      // Upload image and get reference
      let imageRef = null;
      if (product.image) {
        imageRef = await uploadImageToSanity(product.image);
      }

      const sanityProduct = {
        _type: "product",
        name: product.title,
        slug: {
          _type: "slug",
          current: product.title.toLowerCase().replace(/\s+/g, "-"),
        },
        description: product.description,
        price: product.price,
        discount: getRandomDiscount(),
        categories: [],
        stock: Math.floor(Math.random() * 50) + 1,
        label: product.category || "",
        status: "new",
        image: imageRef
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageRef,
              },
            }
          : undefined,
      };

      // Check if the category exists in Sanity
      if (product.category) {
        const existingCategory = await client.fetch(
          `*[_type == "category" && title == $title][0]._id`,
          { title: product.category }
        );
        if (existingCategory) {
          sanityProduct.categories.push({
            _type: "reference",
            _ref: existingCategory,
          });
        }
        console.log(product.category);
      }

      console.log("Uploading product to Sanity:", sanityProduct.name);
      const result = await client.create(sanityProduct);
      console.log(`Product uploaded successfully: ${result._id}`);
    }

    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

importData();





// import { createClient } from "@sanity/client";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import path from "path";

// // Load environment variables from .env.local
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// // Create Sanity client
// const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
//   useCdn: false,
//   token: process.env.SANITY_API_TOKEN,
//   apiVersion: "2021-08-31", // Match with your API version
// });

// // Function to delete all products
// async function deleteAllProducts() {
//   try {
//     console.log("Fetching all product IDs...");
//     const products = await client.fetch(`*[_type == "product"]{_id}`);
//     console.log(`Found ${products.length} products`);

//     for (const product of products) {
//       try {
//         console.log(`Deleting product with ID: ${product._id}`);
//         await client.delete(product._id);
//         console.log(`Product deleted successfully: ${product._id}`);
//       } catch (error) {
//         if (error.response && error.response.body.error.type === 'mutationError') {
//           console.error(`Failed to delete product ${product._id}: ${error.response.body.error.description}`);
//         } else {
//           console.error(`Unexpected error while deleting product ${product._id}:`, error);
//         }
//       }
//     }

//     console.log("All products deletion process completed!");
//   } catch (error) {
//     console.error("Failed to fetch products:", error);
//   }
// }

// deleteAllProducts();
