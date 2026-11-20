import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "../../../lib/auth";
import { stripe } from "../../../lib/stripe";

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Get the logged in user's session
    const authSession = await auth.api.getSession({
      headers: headersList,
    });

    const userEmail = authSession?.user?.email;

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1UdNAFGeiMpU83Rsqo3CYvND",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userEmail,
      success_url: `${origin}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/subscription/cancel`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: "PizzaHub",
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
