import { JOIN } from "@/constants/copy";

/** "Join Our Waitlist" + subtitle, shared by the hero and the closing card. */
export function JoinHeading({ id, as: Tag }: { id: string; as: "h1" | "h2" }) {
  return (
    <div className="flex flex-col gap-[11px] lg:gap-[18px]">
      <Tag
        id={id}
        className="trim-cap text-grad font-display text-[30px] font-medium whitespace-nowrap tracking-[-0.04em] lg:text-[50px]"
      >
        {JOIN.title}
      </Tag>
      <p className="trim-cap text-[13px] capitalize tracking-[-0.04em] text-grey-dim lg:text-[17px]">
        {JOIN.subtitle}
      </p>
    </div>
  );
}
