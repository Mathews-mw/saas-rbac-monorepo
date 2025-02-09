import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content';
import { SaveProjectForm } from '@/app/(app)/org/[slug]/create-project/save-project-form';

export default function CreateProjectPage() {
	return (
		<Sheet defaultOpen>
			<InterceptedSheetContent>
				<SheetHeader>
					<SheetTitle>Create Organization</SheetTitle>
				</SheetHeader>

				<div className="py-4">
					<SaveProjectForm />
				</div>
			</InterceptedSheetContent>
		</Sheet>
	);
}
