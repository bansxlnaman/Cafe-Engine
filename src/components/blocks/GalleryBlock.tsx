interface GalleryBlockProps {
  data: {
    heading?: string;
    images: Array<{
      url: string;
      alt: string;
    }>;
    columns?: number;
  };
}

const GalleryBlock = ({ data }: GalleryBlockProps) => {
  const { heading, images, columns = 3 } = data;

  // If no images, don't render the block
  if (!images || images.length === 0) {
    return null;
  }

  // Grid column classes based on columns prop
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-12">
      {heading && (
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 text-center">
          {heading}
        </h2>
      )}

      <div className={`grid ${gridColsClass} gap-4`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error(`Failed to load image: ${image.url}`);
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryBlock;
