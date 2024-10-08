import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prismadb from "@/app/libs/prismadb";
interface Props {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: Props }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error(`Invalid id`);
  }
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prismadb.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(request: Request, { params }: { params: Props }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error(`Invalid id`);
  }
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prismadb.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  });

  return NextResponse.json(user);
}
