export default function Notification() {
  return (
    <div className="bg-brand-600 text-white text-center py-2 px-4 text-sm font-medium">
      <span className="hidden sm:inline">Free delivery on orders over $50! </span>
      <span className="sm:hidden">Free delivery over $50! </span>
      <a href="/menu" className="underline hover:no-underline font-semibold">Order Now</a>
    </div>
  );
}
