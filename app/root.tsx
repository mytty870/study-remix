import type { LinksFunction } from "@remix-run/node";
import appStylesHref from "./app.css";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import { ContactRecord, getContacts, createEmptyContact } from "./data";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
]

export const action = async () => {
  const contact = await createEmptyContact()
  // return json({ contact })
  return redirect(`/contacts/${contact.id}/edit`)
}

export const loader = async () => {
  const contacts = await getContacts()
  return json({ contacts })
}

export default function App() {
  const { contacts } = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            <ul>
              {contacts.map((contact: ContactRecord) => (
                <li key={contact.id}>
                  <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>名無し</i>
                    )}{""}
                    {contact.favorite ? (
                      <span>★</span>
                    ): null}
                  </Link>
                </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div id="sidebar">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
