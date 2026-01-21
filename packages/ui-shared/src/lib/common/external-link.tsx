'use client';

export enum ExternalLinkType {
  Link,
  Phone,
  Email,
}

interface ExternalLinkProps {
  url?: string;
  linkText?: string;
  linkType?: ExternalLinkType;
}

export function ExternalLink({
  url,
  linkText,
  linkType = ExternalLinkType.Link,
}: ExternalLinkProps) {
  const svgPath = (linkType: ExternalLinkType) => {
    switch (linkType) {
      case ExternalLinkType.Phone:
        return (
          <>
            <path d="M7.25 11.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" />
            <path
              fillRule="evenodd"
              d="M6 1a2.5 2.5 0 0 0-2.5 2.5v9A2.5 2.5 0 0 0 6 15h4a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 10 1H6Zm4 1.5h-.5V3a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5v-.5H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1Z"
              clipRule="evenodd"
            />
          </>
        );

      case ExternalLinkType.Email:
        return (
          <>
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </>
        );

      default:
        return (
          <>
            <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
            <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
          </>
        );
    }
  };

  const urlScheme = (url?: string, linkType?: ExternalLinkType) => {
    if (!url || url === ``) return '';
    switch (linkType) {
      case ExternalLinkType.Email:
        return `mailto:${url}`;

      case ExternalLinkType.Phone:
        return `tel:${url}`;

      default:
        return url;
    }
  };

  return (
    url &&
    url !== '' && (
      <a
        className="link flex link-info"
        href={urlScheme(url, linkType)}
        target={linkType === ExternalLinkType.Link ? '_blank' : '_self'}
        rel={linkType === ExternalLinkType.Link ? 'noopener noreferrer' : ''}
      >
        <span>{linkText ? linkText : url}</span>
        <div className=" pl-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            {svgPath(linkType)}
          </svg>
        </div>
      </a>
    )
  );
}

export default ExternalLink;
