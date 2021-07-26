import client from "../../client";

export default {
	Query: {
		seePhotoComments: (_, { id }) =>
			client.photo.findMany({
				where: {
					id,
				},
				orderBy: {
					createdAt: "asc",
				},
			}),
	},
};