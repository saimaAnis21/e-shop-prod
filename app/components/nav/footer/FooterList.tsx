interface FooterListProps {
  children: React.ReactNode;
  heading: String;
}

const FooterList: React.FC<FooterListProps> = ({heading, children }) => {
  return (
    <div
      className="
    w-full
    sm:w-1/2
    md:w-1/4
    lg:w-1/6
    mb-6
    flex
    flex-col
    gap-2
    ">
      <h3 className="text-base font-bold mb-2">Shop Categories</h3>
      {children}
    </div>
  );
};

export default FooterList
