import Container from "@/components/Container";
import ProductList from "@/components/ProductList";
import { getAllCategory, getProductCategory } from "@/sanity/helpers";

interface Props {
  params: Promise<{ slug: string }>

}

const CategorisePage = async ({ params }: Props) => {
  const { slug } = await params;
  const categorise = await getAllCategory()
  const products = await getProductCategory(slug);

  return (
    <div className="flex flex-col items-center bg-gray-100">
      <Container className="p-8 bg-white rounded-lg shadow-md mt-3 w-full">
        <h1 className="text-2xl md:text-3xl font-bold">Search result for <span className="text-darkBlue">
          {slug.split("-").map((work) => work.charAt(0).toUpperCase() + work.slice(1)).join(" ")} </span>Collection</h1>
          <ProductList products={products} categorise={categorise}/>
      </Container>
    </div>
  )
}

export default CategorisePage;