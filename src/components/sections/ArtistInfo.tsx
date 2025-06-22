import React from 'react';

interface ArtistInfoProps {
  username: string;
  profileImage: string;
}

export const ArtistInfo: React.FC<ArtistInfoProps> = ({ username, profileImage }) => {
  return (
    <section className="flex flex-col justify-center mt-2.5 text-center whitespace-nowrap w-[81px]">
      <h3 className="text-sm font-black text-indigo-900">
        ARTISTA
      </h3>
      <img
        src={profileImage}
        className="object-contain self-center mt-2.5 w-full aspect-[1.03]"
        alt={`Perfil do artista ${username}`}
      />
      <p className="mt-2.5 text-base font-semibold text-indigo-800">
        {username}
      </p>
    </section>
  );
}; 