import { render } from "@testing-library/react";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";

describe("MovieCardSkeleton", () => {
    it("renders without crashing", () => {
        const { container } = render(<MovieCardSkeleton />);

        // Ensure the skeleton is rendered
        expect(container.firstChild).toHaveClass("animate-pulse");
    });
});
