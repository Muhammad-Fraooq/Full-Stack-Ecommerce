import { sanityFetch } from "../lib/live";
import { CATEGORISE_QUERY, MY_ORDERS_QUERY, PRODUCT_BY_CATEGORY_QUERY, PRODUCT_BY_SLUG, PRODUCT_QUERY, PRODUCT_SEARCH_QUERY, SALE_QUERY } from "./querise";

export const getSale = async () => {
    try {
        const sales = await sanityFetch({ query: SALE_QUERY });
        return sales?.data || [];
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return [];
    }
}
export const getAllProduct = async () => {
    try {
        const products = await sanityFetch({ query: PRODUCT_QUERY });
        return products?.data || [];
    } catch (error) {
        console.error('Error fetching All product data:', error);
        return [];
    }
}
export const getAllCategory = async () => {
    try {
        const category = await sanityFetch({ query: CATEGORISE_QUERY });
        return category?.data || [];
    } catch (error) {
        console.error('Error fetching all category data:', error);
        return [];
    }
}
export const getProductBySlug = async (slug: string) => {
    try {
        const product_by_slug = await sanityFetch({ query: PRODUCT_BY_SLUG, params: { slug } });
        return product_by_slug?.data || null;
    } catch (error) {
        console.error('Error fetching Product by slug data:', error);
        return null;
    }
}
export const getProductSearchQuery = async (searchParam: string) => {
    try {
        const product_search_query = await sanityFetch({
            query: PRODUCT_SEARCH_QUERY,
            params: { searchParam, }
        });
        return product_search_query?.data || [];
    } catch (error) {
        console.error('Error fetching Search data:', error);
        return [];
    }
}
export const getProductCategory = async (categorySlug: string) => {
    try {
        const product_category_query = await sanityFetch({
            query: PRODUCT_BY_CATEGORY_QUERY,
            params: { categorySlug, }
        });
        return product_category_query?.data || [];
    } catch (error) {
        console.error('Error fetching category data:', error);
        return [];
    }
}
export const getMyOrders = async (userId: string) => {
    if (!userId) {
      throw new Error('User ID is required!');
    }
  
    const retries = 3;
    let attempt = 0;
  
    while (attempt < retries) {
      try {
        // Call the sanityFetch function with your query and parameters
        const my_orders = await sanityFetch({
          query: MY_ORDERS_QUERY,
          params: { userId },
        });
  
        // Return the fetched data or an empty array if no data is available
        return my_orders?.data || [];
      } catch (error) {
        attempt += 1;
        console.error(`Error fetching orders (Attempt ${attempt}):`, error);
  
        // Retry after 1 second if not the last attempt
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry after 1 second
        }
  
        // If it's the last attempt, throw the error
        if (attempt === retries) {
          throw new Error('Failed to fetch orders after multiple attempts.');
        }
      }
    }
  };
  
// export const getAboutUs = async () => {
//     try {
//         const About_Us = await sanityFetch({
//             query: ABOUT_US
//         });
//         return About_Us?.data || [];
//     } catch (error) {
//         console.error('Error fetching About Us :', error);
//         return [];
//     }
// }
 




// export const getMyOrders = async (userId: string) => {
//     if (!userId) {
//         throw new Error('User ID is required!')
//     }
//     try {
//         const my_orders = await sanityFetch({
//             query: MY_ORDERS_QUERY,
//             params: { userId, }
//         });
//         return my_orders?.data || [];
//     } catch (error) {
//         console.error('Error fetching orders :', error);
//         return [];
//     }
// }
