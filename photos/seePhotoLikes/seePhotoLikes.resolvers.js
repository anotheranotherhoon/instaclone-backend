import client from "../../client";

export default {
	Query: {
		seePhotoLikes: (_, { id }) => {
			const likes = client.like.findMany({
				where: {
					photoId: id,
				},
				select: {
					user: true
				},
			});
			return likes.map((like) => like.user)
		},
	},
};