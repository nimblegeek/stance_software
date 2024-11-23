import { Link } from "wouter";

export default function NavBar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">
            Stance
          </a>
        </Link>
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/">
                <a className="text-sm font-medium hover:text-primary">
                  Find Open Mats
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
