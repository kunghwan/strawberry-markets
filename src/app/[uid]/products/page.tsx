const MyProducts = async (props: any) => {
  const { uid } = await props.params;
  return <div>MyProducts:{uid}</div>;
};

export default MyProducts;
