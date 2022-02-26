
const links = [
  {
    name: 'RPC Gateway',
    href: 'https://rpc.valist.io',
  },
  {
    name: 'IPFS Gateway',
    href: 'https://gateway.valist.io/',
  },
  {
    name: 'Valist Github',
    href: 'https://github.com/valist-io',
  },
];

export default function HomepageLinks():JSX.Element {
  return (
    <section aria-labelledby="references-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="p-6">
          <h2 className="text-base font-medium text-gray-900" id="references-title">Quick Links</h2>
          <div className="flow-root mt-2">
            <ul className="list-disc ml-4">
              {links.map((link) => <li key={link.href}>
                <span>{link.name} - <a className="text-blue-500" href={link.href}>
                  {link.href}</a>
                </span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}