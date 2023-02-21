// app/auth.server.ts
import { Authenticator } from "remix-auth";
import type { DiscordProfile, PartialDiscordGuild } from "remix-auth-discord";
import { DiscordStrategy } from "remix-auth-discord";
import { sessionStorage } from "~/session.server";
import config from "~/config";

export interface DiscordUser {
  id: DiscordProfile["id"];
  displayName: DiscordProfile["displayName"];
  avatar: DiscordProfile["__json"]["avatar"];
  discriminator: DiscordProfile["__json"]["discriminator"];
  email: DiscordProfile["__json"]["email"];
  guilds?: Array<PartialDiscordGuild>;
  accessToken: string;
  refreshToken: string;
}

export const auth = new Authenticator<DiscordUser>(sessionStorage);

const discordStrategy = new DiscordStrategy(
  {
    clientID: DISCORD_ID,
    clientSecret: DISCORD_SECRET,
    callbackURL: `${config.SITE_URL}/auth/discord/callback`,
    // Provide all the scopes you want as an array
    scope: ["identify"],
    prompt: "none",
  },
  async ({
    accessToken,
    refreshToken,
    extraParams,
    profile,
  }): Promise<DiscordUser> => {
    /**
     * Construct the user profile to your liking by adding data you fetched etc.
     * and only returning the data that you actually need for your application.
     */
    return {
      id: profile.id,
      displayName: profile.__json.username,
      avatar: profile.__json.avatar,
      discriminator: profile.__json.discriminator,
      email: profile.__json.email,
      accessToken,
      refreshToken,
    };
  },
);

auth.use(discordStrategy);
