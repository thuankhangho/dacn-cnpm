<?php

namespace App\Http\Services;

use App\Models\Label;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\LazyCollection;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuestionBank;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;

class QuestionBankService implements BaseCrudServiceInterface
{

    /**
     * Get filtered results
     *
     * @param array $search
     * @param int $pageSize
     * @return LengthAwarePaginator
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public const NAME = "QBService";

    public function getName(): string
    {
        return self::NAME;
    }

    public function getAllPaginated(array $search = [], int $pageSize = 15): LengthAwarePaginator
    {
        $search["users"] = Auth::user()->id;
        return QuestionBank::filter($search)->paginateFilter($pageSize);
    }

    /**
     * Get all records as collection
     *
     * @param array $search
     * @return EloquentCollection
     */
    public function getAll(array $search = []): EloquentCollection
    {
        $search["users"] = Auth::user()->id;
        return QuestionBank::filter($search)->get();
        // return $this->repository->getAll($search);
    }

    /**
     * Get all records as lazy collection (cursor)
     *
     * @param array $search
     * @return LazyCollection
     */
    // public function getAllAsCursor(array $search = []): LazyCollection
    // {
    //     return QuestionBank::filter($search)->cursor();
    //     // return $this->repository->getAllCursor($search);
    // }

    /**
     * Get results count
     *
     * @throws RepositoryException
     */
    public function count(array $search = []): int
    {
        return QuestionBank::filter($search)->count();
        // return $this->repository->count($search);
    }

    /**
     * Find or fail the model
     *
     * @param $key
     * @param string|null $column
     * @return Model
     */
    public function findOrFail($key, string $column = null): Model
    {
        $search = [
            $column => $key
        ];
        return QuestionBank::filter($search)->first();
    }

    /**
     * Find models by attributes
     *
     * @param array $attributes
     * @return Collection
     */
    public function find(array $attributes): Collection
    {
        return QuestionBank::filter($attributes)->get();
    }

    /**
     * Create model
     *
     * @param array $data
     * @return Model|null
     * @throws ServiceException
     */
    public function create(array $data): ?Model
    {
        $model = resolve(QuestionBank::class);
        $owner = Role::where("name","owner")->first();
        if (!$model->fill($data)->save()) {
            return null;
        }
        else {
            Auth::user()->addRole($owner, $model);
            $parent = Label::create(["name" => "Generic Parent","description" => "Generic default","question_bank_id" => $model->id]);
            Label::create(
            [
                "name" => "Generic",
                "description" => "Generic sublabel",
                "label_id" => $parent->id,
                "question_bank_id" => $model->id
            ]);
        }

        if (!is_array($model->getKey())) {
            return $model->refresh();
        }

        return $model;
    }

    /**
     * Insert data into db
     *
     * @param array $data
     * @return bool
     */
    public function insert(array $data): bool
    {
        $qb = new QuestionBank();
        $qb -> name = $data["name"];
        $owner = Role::where("name","owner")->first();
        $saved = $qb->save();
        if ($saved) {
            Auth::user()->addRole($owner, $qb);
        }
        return $saved;
    }

    /**
     * Create many models
     *
     * @param array $attributes
     * @return Collection
     * @throws ServiceException
     */
    public function createMany(array $attributes): Collection
    {
        if (empty($attributes)) {
            throw new Exception('Data is empty');
        }

        return DB::transaction(function () use ($attributes) {
            $models = collect();

            foreach ($attributes as $data) {
                $models->push($this->create($data));
            }

            return $models;
        });
    }

    /**
     * Update or create model
     *
     * @param array $attributes
     * @param array $data
     * @return Model|null
     * @throws ServiceException
     */
    public function updateOrCreate(array $attributes, array $data): ?Model
    {
        if (is_null($model = QuestionBank::updateOrCreate($attributes, $data))) {
            throw new Exception('Error while creating or updating the model');
        }

        return $model;
    }

    /**
     * Update model
     *
     * @param $keyOrModel
     * @param array $data
     * @return Model|null
     */
    public function update($keyOrModel, array $data): ?Model
    {
        $qb = QuestionBank::find($keyOrModel);
        $qb -> name = $data["name"];
        $qb -> save();
        return $qb;
    }

    /**
     * Delete model
     *
     * @param $keyOrModel
     * @return bool
     * @throws Exception
     */
    public function delete($keyOrModel): bool
    {
        if (is_int($keyOrModel)||is_string($keyOrModel)) {
            return QuestionBank::where("id",$keyOrModel)->delete();
        }
        return $keyOrModel->delete();
    }

    /**
     * Delete many records
     *
     * @param array $keysOrModels
     * @return void
     */
    public function deleteMany(array $keysOrModels): void
    {
        DB::transaction(function () use ($keysOrModels) {
            foreach ($keysOrModels as $keyOrModel) {
                $this->delete($keyOrModel);
            }
        });
    }
}
